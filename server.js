const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Route untuk upload dan konversi gambar CMYK ke RGB
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const inputPath = req.file.path;
        const outputPath = `uploads/${req.file.originalname}`;

        // Menggunakan Sharp untuk mengonversi dari CMYK ke RGB
        await sharp(inputPath)
            .toColorspace('srgb')  // Konversi CMYK ke RGB
            .jpeg({ quality: Number(req.body.quality, 100) ?? 100 })  // Simpan sebagai JPEG dengan kualitas yang diatur
            .toFile(outputPath);

        // Mengirimkan file hasil konversi
        res.download(outputPath, `convert-${req.file.originalname}`, (err) => {
            if (err) {
                console.error(err);
            }

            // Hapus file sementara
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error converting image');
    }
});

// Menjalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});