import { Category } from "../models/category.model.js";


const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = new Category({ 
            name,
            description: `${name} description`
         });
        await category.save();
        res.status(201).json({ category, message: "Category created successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ categories, message: "Categories fetched successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        res.status(200).json({ category , message: "Category fetched successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updatedCategory = { name, description: `${name} description` };
        const category = await Category.findByIdAndUpdate(id, updatedCategory, { new: true });
        res.status(200).json({ category , message: "Category updated successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const categoryController = {

    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}