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

const Expenses = new schma({
  name: String,
  Transaction: [{ type: schma.Types.ObjectId, ref: "Expenses" }],
  Balance: { type: Number, default: 0 },
  parent: {
    type: schma.Types.ObjectId,
    default: null,
    ref: "Expenses",
  },
  ancestors: [
    {
      _id: {
        type: schma.Types.ObjectId,
        ref: "Expenses",
        index: true,
      },
      name: String,
      slug: String,
    },
  ],
  Currency: { type: String, default: "Rupee (pkr)" },
  slug: { type: String, index: true },
});

Expenses.pre("save", async function (next) {
  this.slug = slugify(this.name);
  next();
});

module.exports = mongoose.model("Expenses", Expenses);
