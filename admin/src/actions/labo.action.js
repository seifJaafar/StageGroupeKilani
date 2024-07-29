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
export async function UpdateLabo(id, labo) {
    try {
        const response = await axios.patch(`/laboratoire/${id}`, labo);
        if (response.status === 200) {
            toast.success("Laboratoire Updated", {});
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
export async function DeleteLabo(id) {
    try {
        const response = await axios.delete(`/laboratoire/${id}`);
        if (response.status === 200) {
            toast.success("Laboratoire supprimée", {});
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
export async function AddNewLabo(NewLabo) {
    try {
        const response = await axios.post(`/laboratoire`, NewLabo);
        if (response.status === 200) {
            toast.success("Laboratoire ajouté", {});
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