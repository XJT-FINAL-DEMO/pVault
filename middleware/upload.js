import multer from "multer";
import {v2 as cloudinary} from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";


cloudinary.config ({
cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
api_key: process.env.CLOUDINARY_API_KEY,
api_secret: process.env.CLOUDINARY_API_SECRET
});

export const blogsCoverPhotoUpload = multer({
    storage: new CloudinaryStorage({
        cloudinary,
        params: {
            folder: 'pVault/blogs/pictures'
        }
    })
}).single('image')



export const prescriptionUpload = multer ({
    storage: new CloudinaryStorage({
        cloudinary,
        params:{
            folder: 'pVault/prescriptions',
            allowed_formats: ['jpg','jpeg','pdf'],
            resource_type:'auto'
        }
    
    }),
    fileFilter:(req, file, cb) => {
        const allowedMimeTypes = [
            'image/jpeg',
            'image/jpg',
            'application/pdf'
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else{
            cb(new Error('Only JPG/PDF files are allowed!'), false);
        }
        },
        limits: {
            fileSize: 5 * 1024 *1024
        }
        
        
        // if (
        //     file.mimetype == 'image/jpeg' ||'image/jpg' || 'image/pdf'
        // ){
        //     cb(null, true)
        // }else { cb(new Error('Only JPG/PDF files are allowed!'), false);}

    
});

export {cloudinary}