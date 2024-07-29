import axios from '../custom/axios';
import { toast } from 'react-hot-toast';


export async function GetAllLabs() {
    try {
        const response = await axios.get(`/laboratoire`);
        return {
            labs: response.data.data.laboratoires
        };
    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}
export async function GetProduits(laboratoire) {
    try {

        const response = await axios.get(`/produit/byLabo`, { params: { laboratoire } });

        return {
            produits: response.data.data.produits
        };
    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}
export async function GetVentes(laboratoire, Begindate, EndDate, field, selectedProduit) {
    try {
        const response = await axios.get(`/laboratoire/ventes`, { params: { laboratoire, Begindate, EndDate, field, selectedProduit } });

        return {
            data: response.data.data.ventes
        };
    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}