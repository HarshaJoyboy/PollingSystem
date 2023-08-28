import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Table, TableCell,TableHead,TableBody, TableRow } from '@material-ui/core';
import { Line , Bar} from 'react-chartjs-2';
import { BarElement,  CategoryScale,Chart as ChartJS,PointElement,LineElement,Legend, LinearScale,Title, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, BarElement,Title,Tooltip,Legend);

function GetVotes() {
    const [items, setItems] = useState([]);
    const [count, setCounts] = useState([]);
    const [choice, setChoices] = useState([]);
    const [countTrue, setCountTrue] = useState([]);
    const [dateTrue, setDateTrue] = useState([]);
    const [countFalse, setCountFalse] = useState([]);
    const [dateFalse, setDateFalse] = useState([]);
    useEffect( () => {
        fetchItems();
        
        // Fetch bar chart data for overall results
        axios.get('http://localhost:4000/results').then((response) => {
        const counts = response.data.data.map((item) => item.count);
        setCounts(counts);
        const choices = response.data.data.map((item) => item.voting_choice ? 'True' : 'False');
        setChoices(choices);
        });

        // Fetch line chart data for overall results as true
        axios.get('http://localhost:4000/countstrue').then((response) => {
        const countsTrue = response.data.data.map((item) => item.count);
        setCountTrue(countsTrue);
        const datesTrue = response.data.data.map((item) => item.casted_at);
        setDateTrue(datesTrue);
        });

        // Fetch line chart data for overall results as false
        axios.get('http://localhost:4000/countsfalse').then((response) => {
        const countsFalse = response.data.data.map((item) => item.count);
        setCountFalse(countsFalse);
        const datesFalse = response.data.data.map((item) => item.casted_at);
        setDateFalse(datesFalse);
        });

    }, []);

    const fetchItems = async () => {
        const data = await fetch('http://localhost:4000/data');
        const items = await data.json();
        setItems(items);
    };

    const option = {
        responsive: true,
        plugins: {
            legend: { position: "chartArea" },
            title: {
            display: true,
            text: "Bar Chart",
            },
        },
    };
        
    const data = {
        labels: choice,
        datasets: [
            {
            label:choice[0],
            data: count,
            backgroundColor: ['blue','red'],
            }
        
        ],  
    };

    const lineoption = {
        responsive: true,
        plugins: {
          legend: {
            position: "chartArea",
          },
          title: {
            display: true,
            text: 'Line Chart',
          },
        },
    };

    const linedata = {
        labels:dateFalse,
        datasets: [
          {
            label: 'True',
            data: countTrue,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'False',
            data: countFalse,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          }
        ],
    };
    return(
        <section>   
            <div class="container-fluid">
                <h1 class="mt-5">Votes Table</h1>
                <Table style={{ width:"50%", marginLeft:"30%", marginBottom:"5%"}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Vote Choice</TableCell>
                            <TableCell>Date of Submission</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.voting_choice ? 'True' : 'False'}</TableCell>
                            <TableCell>{item.casted_at}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Line style={{ alignContent:"center", maxWidth: "650px" ,maxHeight:"650px",display:"inline"}} options={lineoption} data={linedata} />
            <Bar style={{ alignContent:"center", maxWidth: "650px" ,maxHeight:"650px",display:"inline"}} options={option} data={data} />
            
        </section>
    );
}

export default GetVotes;