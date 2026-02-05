import Image from "@tiptap/extension-image";

export const PreviewImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        renderHTML: (attributes) => ({
          width: attributes.width,
        }),
      },
      originalWidth: {
        default: null,
      },
      originalHeight: {
        default: null,
      },
    };
  },
});
