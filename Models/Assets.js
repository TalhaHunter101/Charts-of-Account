const mongoose = require("mongoose");
const schma = mongoose.Schema;
function slugify(string) {
  const a =
    "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
  const b =
    "aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------";
  const p = new RegExp(a.split("").join("|"), "g");

  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

const Assets = new schma({
  name: { type: String, unique: true },
  Transaction: [],
  Balance: { type: Number, default: 0 },
  parent: {
    type: schma.Types.ObjectId,
    default: null,
    ref: "Assets",
  },
  ancestors: [
    {
      _id: {
        type: schma.Types.ObjectId,
        ref: "Assets",
        index: true,
      },
      name: String,
      slug: String,
    },
  ],
  Currency: { type: String, default: "Rupee (pkr)" },
  slug: { type: String, index: true },
});

Assets.pre("save", async function (next) {
  this.slug = slugify(this.name);
  next();
});

module.exports = mongoose.model("Assets", Assets);
