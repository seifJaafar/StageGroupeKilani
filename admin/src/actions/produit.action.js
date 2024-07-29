import axios from '../custom/axios';
import { toast } from 'react-hot-toast';

export async function AddNewProduit(NewProduit) {
    try {
        const response = await axios.post(`/produit`, NewProduit);
        if (response.status === 200) {
            toast.success("Produit ajouté", {});
            return true;

        } else {
            toast.error(response?.message);
        }
    } catch (err) {
        console.error(err?.response);
        if (err?.response) {
            toast.error(err?.response?.data.message);
        }
        return { error: err?.response?.data?.message };
    }
}
export async function GetAllProducts() {
    try {
        const response = await axios.get(`/produit`);
        return {
            products: response.data.data.produits
        };
    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}
export async function UpdateProduit(id, produit) {
    try {
        const response = await axios.patch(`/produit/${id}`, produit);
        if (response.status === 200) {
            toast.success("Produit Updated", {});
            return true;
        } else {
            toast.error(response?.message);
        }
    } catch (err) {
        console.error(err?.response);
        if (err?.response) {
            toast.error(err?.response?.data.message);
        }
        return { error: err?.response?.data?.message };
    }
}
export async function DeleteProduit(id) {
    try {
        const response = await axios.delete(`/produit/${id}`);
        if (response.status === 200) {
            toast.success("Produit supprimée", {});
            return true;
        } else {
            toast.error(response?.message);
        }
    } catch (err) {
        console.error(err?.response);
        if (err?.response) {
            toast.error(err?.response?.data.message);
        }
        return { error: err?.response?.data?.message };
    }
}