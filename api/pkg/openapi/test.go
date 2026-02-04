package openapi

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/sashabaranov/go-openai"
	"github.com/vantan-project/flare/internal/custom"
)

// PostAnalysis は投稿の分析結果を保持する構造体
type PostAnalysis struct {
	CorePoint  int `json:"core_point" jsonschema:"title=Core Point,description=コア度（ユーモアやニッチかどうか）0-100の整数,minimum=0,maximum=100"`
	FlarePoint int `json:"flare_point" jsonschema:"title=Flare Point,description=熱意度（他人に薦めたい度合い）0-100の整数,minimum=0,maximum=100"`
}

// PostInput は投稿の入力データ
type PostInput struct {
	Title   string   `json:"title"`
	Content string   `json:"content"` // マークダウン形式
	Tags    []string `json:"tags"`
}

// AnalyzePost は投稿を分析してcore_pointとflare_pointを返す
func AnalyzePost(ai *custom.AI, ctx context.Context, post PostInput) (*PostAnalysis, error) {
	// 画像数をカウント
	imageCount := countMarkdownImages(post.Content)

	// プロンプトの構築
	promptText := fmt.Sprintf(`以下の習慣に関する投稿を分析し、2つのスコアを0-100の整数で評価してください。

【投稿情報】
タイトル: %s
タグ: %v
画像数: %d
本文:
%s

【評価基準】
1. core_point (コア度):
   - この投稿がどれだけユーモラスか、ニッチか、独自性があるかを評価
   - 一般的で平凡な内容なら低く（0-30）
   - ユニークで面白い視点があれば中程度（31-70）
   - 非常にユーモラスでニッチな内容なら高く（71-100）

2. flare_point (熱意度):
   - タイトルの魅力度、文章の充実度、画像の活用度から、作者がどれだけ他人に薦めたいかを評価
   - タイトルが魅力的か
   - 文章が詳しく丁寧に書かれているか
   - 画像が効果的に使われているか（多すぎず少なすぎず）
   - 全体的な情熱や推奨度の高さ
   - 中程度の熱意: 0-25
   - 高い熱意: 36-50
	 - 非常に高い熱意: 51-75
   - 最大熱意(ほとんどあり得ない): 76-100
	 - 平均が20になるように厳しめに判定して

以下のJSON形式で返してください（説明文は不要で、JSONのみを返してください）:
{
  "core_point": 整数値,
  "flare_point": 整数値
}`,
		post.Title,
		post.Tags,
		imageCount,
		post.Content,
	)

	// リクエストの構築
	req := openai.CompletionRequest{
		Model:       openai.GPT3Dot5TurboInstruct, // または適切なモデル
		Prompt:      promptText,
		MaxTokens:   500,
		Temperature: 0.3,
	}

	// AIに分析を依頼
	response, err := ai.CreateCompletion(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to create completion: %w", err)
	}

	// レスポンスからテキストを取得
	if len(response.Choices) == 0 {
		return nil, fmt.Errorf("no response from AI")
	}
	responseText := response.Choices[0].Text

	// JSON部分を抽出
	jsonStr := extractJSON(responseText)

	// JSONをパース
	var analysis PostAnalysis
	if err := json.Unmarshal([]byte(jsonStr), &analysis); err != nil {
		return nil, fmt.Errorf("failed to parse analysis result: %w (response: %s)", err, responseText)
	}

	// 値の範囲チェック（念のため）
	if analysis.CorePoint < 0 || analysis.CorePoint > 100 {
		return nil, fmt.Errorf("invalid core_point value: %d", analysis.CorePoint)
	}
	if analysis.FlarePoint < 0 || analysis.FlarePoint > 100 {
		return nil, fmt.Errorf("invalid flare_point value: %d", analysis.FlarePoint)
	}

	return &analysis, nil
}

// extractJSON はレスポンスからJSON部分を抽出する
func extractJSON(response string) string {
	// ```json ... ``` の形式を探す
	if start := strings.Index(response, "```json"); start != -1 {
		start += 7 // "```json" の長さ
		if end := strings.Index(response[start:], "```"); end != -1 {
			return strings.TrimSpace(response[start : start+end])
		}
	}

	// ``` ... ``` の形式を探す
	if start := strings.Index(response, "```"); start != -1 {
		start += 3 // "```" の長さ
		if end := strings.Index(response[start:], "```"); end != -1 {
			return strings.TrimSpace(response[start : start+end])
		}
	}

	// { ... } の形式を探す
	if start := strings.Index(response, "{"); start != -1 {
		if end := strings.LastIndex(response, "}"); end != -1 && end > start {
			return strings.TrimSpace(response[start : end+1])
		}
	}

	// そのまま返す（JSONのみが返された場合）
	return strings.TrimSpace(response)
}

// countMarkdownImages はマークダウン内の画像数をカウントする
func countMarkdownImages(markdown string) int {
	count := 0
	// ![alt](url) 形式の画像をカウント
	for i := 0; i < len(markdown)-1; i++ {
		if markdown[i] == '!' && markdown[i+1] == '[' {
			count++
		}
	}
	return count
}
