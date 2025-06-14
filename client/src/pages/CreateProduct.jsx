import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


let email =""
const CreateProduct = () => {
  const { backendUrl, userData , getUserData} = useContext(AppContext);
  const navigate = useNavigate();


async function fetchData() {
  try {
    const response = await axios.get("http://localhost:4000/api/user/data");
    const data = response.data;
    console.log(data.userData.userId);

    email = data 
 // or data._id or dataID depending on structure
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


fetchData();
console.log("1")
console.log(email)
console.log("3")


  const categories = {
    "Fruits": ["Pommes", "Bananes", "Oranges", "Autre"],
    "Légumes": ["Tomates", "Carottes", "Salades", "Autre"],
    "Huile": ["Olive", "Tournesol", "Colza", "Autre"],
    "Matériaux Agricoles": ["Tracteurs", "Pompes", "Outils", "Autre"]
  };

  const availableUnits = {
    "Fruits": ["Kilogramme", "Gramme", "Bacs"],
    "Légumes": ["Kilogramme", "Gramme", "Bacs"],
    "Huile": ["Litre"],
    "Matériaux Agricoles": []
  };

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    sizes: "",
    bestseller: false
  });

  getUserData();

  const [selectedFile, setSelectedFile] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const newSubCategories = categories[selectedCategory] || [];
    const newUnits = availableUnits[selectedCategory] || [];
    
    setProductData({
      ...productData,
      category: selectedCategory,
      subCategory: "",
      sizes: ""
    });
    setSubCategories(newSubCategories);
    setUnits(newUnits);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!productData.name || !productData.description || !productData.price || 
          !productData.category || !productData.subCategory || !selectedFile) {
        throw new Error("Tous les champs sont obligatoires sauf 'meilleure vente'");
      }

    if (!userData ) {
      throw new Error("User not authenticated");
    }
    
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("category", productData.category);
      formData.append("subCategory", productData.subCategory);
      formData.append("sizes", productData.sizes);
      formData.append("bestseller", productData.bestseller);
      formData.append("userId", email.userData.userId);

      const response = await axios.post(`${backendUrl}/api/product/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.data.success) {
        toast.success("Produit créé avec succès!");
        navigate("/Products");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Créer un nouveau produit</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom*</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            required
          />
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description*</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            required
          />
        </div>

        {/* Price Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Prix*</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            required
          />
        </div>

        {/* Image File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Image du produit*</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
            required
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Catégorie*</label>
          <select
            name="category"
            value={productData.category}
            onChange={handleCategoryChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {Object.keys(categories).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Subcategory Dropdown (appears when category is selected) */}
        {productData.category && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Sous-catégorie*</label>
            <select
              name="subCategory"
              value={productData.subCategory}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              required
            >
              <option value="">Sélectionner une sous-catégorie</option>
              {subCategories.map(subCat => (
                <option key={subCat} value={subCat}>{subCat}</option>
              ))}
            </select>
          </div>
        )}

        {/* Units Dropdown (appears when units are available for the category) */}
        {units.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Unités disponibles*</label>
            <select
              name="sizes"
              value={productData.sizes}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              required={units.length > 0}
            >
              <option value="">Sélectionner une unité</option>
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        )}

        {/* Bestseller Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="bestseller"
            checked={productData.bestseller}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label className="ml-2 block text-sm text-gray-700">Meilleure vente</label>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Création en cours..." : "Créer le produit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;