const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(bodyParser.json());

app.get("/bfhl", (req, res) => {
    res.status(200).json({ operation_code: 1 });
});


app.post("/bfhl", (req, res) => {
    try {
        const { data } = req.body;

        if (!Array.isArray(data)) {
            return res.status(400).json({ is_success: false, message: "Invalid input format" });
        }

        let numbers = [];
        let alphabets = [];

  
        data.forEach(item => {
            if (!isNaN(item)) {
                numbers.push(item);
            } else if (typeof item === "string" && item.match(/^[a-zA-Z]$/)) {
                alphabets.push(item.toUpperCase());
            }
        });

        let highest_alphabet = alphabets.length ? [alphabets.sort().pop()] : [];

        const response = {
            is_success: true,
            user_id: "Anurag_Jangid_30082004",  
            email: "anuragjangid62@gmail.com", 
            roll_number: "22BCS10441",  
            numbers: numbers,
            alphabets: alphabets,
            highest_alphabet: highest_alphabet
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ is_success: false, message: "Internal Server Error" });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
