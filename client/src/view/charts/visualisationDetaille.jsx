import React, { useState, useEffect, useRef } from 'react';
import { Row } from "reactstrap";
import { Calendar } from 'primereact/calendar';
import { Dropdown } from "primereact/dropdown";
import { GetProduits, GetVentes } from '../../actions/labo.action';
import 'primereact/resources/themes/saga-blue/theme.css';
import {
    Chart as ChartJS,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    TimeScale,
    ScatterController,
    BarController,
    BarElement
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import toast from 'react-hot-toast';

ChartJS.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    TimeScale,
    ScatterController,
    BarElement,
    BarController
);

function VisualisationDetaille(props) {
    const { laboratoire } = props;
    const [produits, setProduits] = useState([]);
    const [selectedProduit, setSelectedProduit] = useState(null);
    const [Begindate, setBeginDate] = useState(null);
    const [EndDate, setEndDate] = useState(null);
    const [uiBegindate, setBeginUiDate] = useState(null);
    const [uiEndDate, setUiEndDate] = useState(null);
    const [field, setField] = useState(null);
    const [ventes, setVentes] = useState([]);
    const [type, setType] = useState("line");
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

    const Types = [
        { name: "Ligne", value: "line" },
        { name: "Points", value: "scatter" },
        { name: "Barres", value: "bar" }
    ];

    const fetchVenteData = async () => {
        try {
            const { data } = await GetVentes(laboratoire, Begindate, EndDate, field, selectedProduit);
            setVentes(data);
        } catch (error) {
            console.error("Error fetching ventes:", error);
        }
    };

    const fetchData = async () => {
        try {
            const { produits } = await GetProduits(laboratoire);
            setProduits(produits);
        } catch (error) {
            console.error("Error fetching produits:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (Begindate && EndDate && field && selectedProduit) {
            if (new Date(Begindate) > new Date(EndDate)) {
                toast.error("La date de début ne peut pas être après la date limite.");
                return;
            }
            fetchVenteData();
        }
    }, [Begindate, EndDate, field, selectedProduit]);

    useEffect(() => {
        const ctx = document.getElementById('myChart').getContext('2d');

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const labels = ventes.length > 0 ? ventes.map((item) => new Date(item.date_depot)) : [];
        const data = ventes.length > 0 ? ventes.map((item) => field ? item[field] : item["stock_res_off"]) : [];

        chartRef.current = new ChartJS(ctx, {
            type: type,
            data: {
                labels: labels,
                datasets: [{
                    label: field ? field : "field",
                    data: data,
                    borderColor: type === 'line' ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)', // Red for line, Blue for others
                    backgroundColor: type === 'line' ? 'rgba(255, 99, 132, 0.2)' : 'rgba(54, 162, 235, 0.2)',
                    pointRadius: 10
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: field
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                let label = tooltipItem.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += tooltipItem.raw !== undefined ? tooltipItem.raw : 'N/A';
                                const vente = ventes[tooltipItem.dataIndex];
                                if (vente && vente.reference) {
                                    label += ' | Reference: ' + (vente.reference.code || 'N/A');
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }, [ventes, type]);

    const handleDate = (e) => {
        const date = e.value;
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
    };

    return (
        <>
            <Row className="custom-row">
                <div className="field col-6 md:col-6 custom-col-6">
                    <label htmlFor="date">Date début</label>
                    <Calendar
                        value={uiBegindate}
                        onChange={(e) => { setBeginDate(handleDate(e)); setBeginUiDate(e.value); }}
                        showIcon
                        dateFormat="yy-mm-dd"
                        required
                    />
                </div>
                <div className="field col-6 md:col-6 custom-col-6">
                    <label htmlFor="date">Date Limite</label>
                    <Calendar
                        value={uiEndDate}
                        onChange={(e) => { setEndDate(handleDate(e)); setUiEndDate(e.value); }}
                        showIcon
                        dateFormat="yy-mm-dd"
                        required
                    />
                </div>
                {produits && produits.length > 0 &&
                    (<div className="field col-6 md:col-6 custom-col-6">
                        <label htmlFor="produits">Choisir Produit</label>
                        <Dropdown
                            value={selectedProduit}
                            name="produits"
                            onChange={(e) => { setSelectedProduit(e.value); }}
                            options={produits.map(produit => (
                                { value: produit._id, name: produit.designation }
                            ))}
                            optionLabel="name"
                            optionValue="value"
                            placeholder="Select produits"
                            required
                        />
                    </div>)
                }
                <div className="field col-6 md:col-6 custom-col-6">
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
                <div className="field col-6 md:col-6 custom-col-6">
                    <label htmlFor="type">Choisir Type de graphique</label>
                    <Dropdown
                        value={type}
                        name="type"
                        onChange={(e) => { setType(e.value); }}
                        options={Types}
                        optionLabel="name"
                        optionValue="value"
                        placeholder="Select type"
                        required
                    />
                </div>
            </Row>
            <Row className="custom-row">
                <div className="col-12 md:col-12 custom-col-12">
                    <canvas id="myChart" width="400" height="150"></canvas>
                </div>
            </Row>
        </>
    );
}

export default VisualisationDetaille;
