package tags

import (
	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
)

type tagData struct {
	Id   uint   `json:"id"`
	Name string `json:"name"`
}
type indexResponse struct {
	Data []tagData `json:"data"`
}

func Index(cc *custom.Context) error {
	var tags []model.Tag
	if err := cc.DB.Select("id,name").Find(&tags).Error; err != nil {
		return cc.JSON(500, nil)
	}
	data := make([]tagData, len(tags))
	for i, tag := range tags {
		data[i] = tagData{
			Id:   tag.ID,
			Name: tag.Name,
		}
	}
	return cc.JSON(200, indexResponse{
		Data: data,
	})
}
