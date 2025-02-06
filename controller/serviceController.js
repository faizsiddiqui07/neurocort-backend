const moment = require('moment');
const serviceModel = require('../models/serviceModel');
const cloudinary = require("cloudinary");

const add_service = async (req, res) => {
    try {
        const { serviceName } = req.body

        if (!serviceName) {
            return res.json({
                message: 'Service name is required',
                error: true,
                success: false
            });
        }

        const lowerCaseServiceName = serviceName.trim().toLowerCase();
        const slug = lowerCaseServiceName.split(' ').join('-');
        

        const uploadService = new serviceModel({
            serviceName: serviceName.trim(),
            slug: slug,
            date: moment().format('LL'),
            ...req.body,
        }
        )
        const saveService = await uploadService.save();

        res.status(201).json({
            message: "Service upload successfull",
            error: false,
            success: true,
            data: saveService
        });
    } catch (error) {
        console.error('Error parsing form:', error);
        res.status(400).json({
            message: 'Error parsing form',
            error: true,
            success: false
        });
    }
};

const get_service = async (req, res) => {
    try {
        const allService = await serviceModel.find().sort({ createdAt: -1 })

        return res.status(200).json({
            message: "All Service",
            success: true,
            error: false,
            data: allService
        })
    } catch (error) {
        res.status(400).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
};

const update_service_status = async (req, res) => {
    const { service_id } = req.params
    const { status } = req.body

    const updatedStatus = await serviceModel.findByIdAndUpdate(service_id, { status }, { new: true })
    return res.status(200).json({ message: 'Service status update success', updatedStatus })

};

const delete_service = async (req, res) => {
    const { service_id } = req.params;

    try {
        const service = await serviceModel.findById(service_id);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Check if serviceIcon is an array
        if (Array.isArray(service.serviceIcon)) {
            for (let img of service.serviceIcon) {
                let public_id = "";

                // If serviceIcon is an object with public_id
                if (typeof img === "object" && img.public_id) {
                    public_id = img.public_id;
                }
                // If serviceIcon is a URL, extract public_id
                else if (typeof img === "string" && img.includes("cloudinary.com")) {
                    const parts = img.split("/");
                    public_id = parts[parts.length - 1].split(".")[0];
                }

                // Delete image from Cloudinary
                if (public_id) {
                    await cloudinary.v2.uploader.destroy(public_id);
                    console.log(`Deleted image: ${public_id}`);
                } else {
                    console.warn("Invalid public_id for image:", img);
                }
            }
        }

        // Delete service from database
        await serviceModel.findByIdAndDelete(service_id);

        return res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error("Error deleting Service:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const get_categorywise_service = async (req, res) => {

    try {
        const { service_id } = req.params

        const service = await serviceModel.findById(service_id);
        if (!service) {
            return res.status(404).json({
                message: 'Service not found',
                error: true,
                success: false
            });
        }
        res.status(201).json({
            message: "All Service",
            error: false,
            success: true,
            data: service
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

const update_categorywise_service = async (req, res) => {
    try {
        const { serviceName, serviceIcon, description } = req.body;
        const service = await serviceModel.findById(req.params.service_id); 

        if (!service) {
            return res.status(404).json({ success: false, error: true, message: 'Service not found' });
        }

        const oldImages = service.serviceIcon || [];
        const removedImages = oldImages.filter(img => 
            !serviceIcon.some(newImg => newImg.public_id === img.public_id)
        );

        for (let img of removedImages) {
            if (img.public_id) {
                await cloudinary.v2.uploader.destroy(img.public_id);
                console.log(`Deleted image from Cloudinary: ${img.public_id}`);
            }
        }

        service.serviceName = serviceName;
        service.slug = serviceName.trim().toLowerCase().split(' ').join('-');
        service.serviceIcon = serviceIcon;
        service.description = description;

        await service.save();

        res.json({ success: true, error: false, message: 'Service updated successfully', service });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



// For website
const get_service_for_website = async (req, res) => {
    try {
        const allService = await serviceModel.find({status:"active"})

        return res.status(200).json({
            message: "All Service",
            success: true,
            error: false,
            data: allService
        })
    } catch (error) {
        res.status(400).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

const get_single_service_for_website = async (req, res) => {
    
    const { slug } = req.query;

    try {
        const singleService = await serviceModel.findOne({ slug: slug });

        if (!singleService) {
            return res.status(404).json({
                message: "Service not found",
                success: false,
                error: true,
            });
        }
        

        return res.status(200).json({
            message: "Get Service",
            success: true,
            error: false,
            data: singleService
        });
    } catch (error) {
        res.status(400).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};





module.exports = {
    add_service,
    get_service,
    update_service_status,
    delete_service,
    get_categorywise_service,
    update_categorywise_service,
    get_service_for_website,
    get_single_service_for_website
};
