
exports.bulkUploadManualChargeItemsHandler = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Excel file is required" });

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const errorRows = [];

    for (let i = 0; i < data.length; i++) {
      const { itemName, category, defaultPrice, description } = data[i];

      // Skip rows with missing required fields
      if (!itemName || !category || defaultPrice === undefined || defaultPrice === null || defaultPrice === '') {
        continue;
      }

      // Normalize price: remove commas
      let price = defaultPrice;
      if (typeof price === "string") {
        price = price.replace(/,/g, "").trim();
      }
      const numericPrice = Number(price);

      if (isNaN(numericPrice)) {
        errorRows.push(i + 2);
        continue;
      }

      // SKIP duplicates without error
      const exists = await ManualChargeItem.findOne({ itemName });
      if (exists) {
        continue;
      }

      // Save
      await new ManualChargeItem({
        itemName,
        category,
        defaultPrice: numericPrice,
        description: description || ""
      }).save();
    }

    if (errorRows.length > 0) {
      return res.status(400).json({ message: "Some rows failed", errorRows });
    }

    return res.status(200).json({ message: "Bulk upload successful!" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};