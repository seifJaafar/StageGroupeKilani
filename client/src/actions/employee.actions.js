import axios from '../custom/axios';


export async function Upload(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`/employee/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return {
            data: response.data.data
        };
    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}
export async function Create(data, date, laboratoire) {
    try {
        const response = await axios.post(`/employee/create`, { data, date, laboratoire });

        return {
            data: response.data.data
        };
    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}
export async function GetAllReferences(LaboratoireID) {
    try {
        const response = await axios.get(`/employee/references`, {
            params: { laboratoire: LaboratoireID }
        });

        if (!response.data.data || response.data.data.length === 0) {
            return { error: "Aucune référence trouvée" };
        }
        return {
            data: response.data.data
        };
    } catch (err) {
        console.error(err?.response);
        return { error: err?.response?.data?.message };
    }
}
export async function GetProduitsByReference(refid) {
    try {
        const response = await axios.get(`/employee/reference/${refid}`);

        if (!response.data.data || response.data.data.length === 0) {
            return { error: "Aucun produit trouvé" };
        }
        return {
            data: response.data.data
        };
    } catch (err) {
        console.error(err?.response);
        return { error: err?.response?.data?.message };
    }
}
export async function GetValidData(data) {
    try {
        const response = await axios.post(`/employee/validData`, { data });
        if (!response.data.data || response.data.data.length === 0) {
            return { error: "Probleme" };
        }
        return {
            data: response.data.data
        };
    } catch (err) {
        console.error(err?.response);
        return { error: err?.response?.data?.message };
    }
}