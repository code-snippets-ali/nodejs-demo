const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    /*
    The most common units of measurement for medication dosages are milligrams (mg) and micrograms (mcg). Other units of measurement that may be used include:

Grams (g) - typically used for larger dosages of medication, such as those used in hospital settings
International units (IU) - used for some vitamins and hormones
Teaspoons (tsp) or tablespoons (tbsp) - used for liquid medications
Milliliters (mL) or cubic centimeters (cc) - used for liquid medications
Pounds (lb) or kilograms (kg) - used for body weight-based dosages
Units (U) - used for insulin and other hormones
    */
    dosageUnit: String,
    description: String,
    quantity: String,
});

const Medicine = mongoose.model("Medicine", medicinSchema);

exports.Medicin = Medicin;
