import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from "primereact/dropdown";
import { Chart as ChartJS, PieController, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { GetVentes } from '../../actions/labo.action';
import toast from 'react-hot-toast';

ChartJS.register(
    PieController,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function VisualisationGeneral(props) {
    const { laboratoire } = props;
    const [ventes, setVentes] = useState([]);
    const [field, setField] = useState(null);
    const [productData, setProductData] = useState(null);
    const chartRef = useRef(null);

    const fields = [
        { name: "stock Res Off", value: 'stock_res_off' },
        { name: "Cm", value: "cm" },
        { name: "Mois", value: "mois" },
        { name: "Vente Res Off", value: "vente_res_off" },
        { name: "Entrée", value: "entree" },
        { name: "Réception", value: "reception" },
        { name: "S/Douane", value: "s_douane" },
        { name: "Annoncé", value: "annonce" },
        { name: "Solde Code", value: "solde_code" },
        { name: "Encours", value: "encours" }
    ];

    const fetchData = async () => {
        try {
            const { data } = await GetVentes(laboratoire);
            setVentes(data);
        } catch (error) {
            console.error("Error fetching ventes:", error);
            toast.error("Erreur lors du chargement des ventes.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (field && ventes.length > 0) {
            const productMap = new Map();

            ventes.forEach(vente => {
                const productId = vente.libelle;
                const fieldValue = vente[field];

                if (!productMap.has(productId)) {
                    productMap.set(productId, 0);
                }
                productMap.set(productId, productMap.get(productId) + fieldValue);
            });


            const productChartData = {
                labels: Array.from(productMap.keys()),
                datasets: [{
                    label: field,
                    data: Array.from(productMap.values()),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(255, 99, 132, 0.6)'
                    ]
                }]
            };

            setProductData(productChartData);
        }
    }, [field, ventes]);

    useEffect(() => {

        if (productData) {
            const ctx = document.getElementById('pieChart').getContext('2d');
            if (chartRef.current) {
                chartRef.current.destroy();
            }
            chartRef.current = new ChartJS(ctx, {
                type: 'pie',
                data: productData,
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: `Répartition de ${field}`
                        },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem) {
                                    return `${tooltipItem.label}: ${tooltipItem.raw}`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }, [productData]);

    return (
        <>
            <div className="field col-6 md:col-6 custom-col-6 mx-auto">
                <label htmlFor="field">Choisir champ</label>
                <Dropdown
                    value={field}
                    name="field"
                    onChange={(e) => { setField(e.value); }}
                    options={fields}
                    optionLabel="name"
                    optionValue="value"
                    placeholder="Select field"
                    required
                />
            </div>
            {productData && (
                <div className="d-flex justify-content-center align-items-center">
                    <div className="col-6 md:col-6 custom-col-6 d-flex justify-content-center align-items-center ">
                        <canvas id="pieChart" width="600" height="600"></canvas>
                    </div>
                </div>

            )}
        </>
    );
}

export default VisualisationGeneral;
