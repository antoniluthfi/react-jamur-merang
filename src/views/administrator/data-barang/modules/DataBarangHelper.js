import { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const DataBarangHelper = () => {
    const baseUrl = process.env.REACT_APP_LARAVEL_URL;
    const fields = [
        {
            key: 'id',
            label: 'No',
            _style: { textAlign: 'center' },
        },
        {
            key: 'nama_barang',
            label: 'Nama Barang',
            _style: { textAlign: 'center' },
        },
        {
            key: 'harga_retail',
            label: 'Harga Retail',
            _style: { textAlign: 'center' },
        },
        {
            key: 'show_details',
            label: '',
            _style: { width: '1%' },
            sorter: false,
            filter: false
        }
    ];

    const [success, setSuccess] = useState(false);
    const [dataBarang, setDataBarang] = useState([]);
    const [loadDataBarang, setLoadDataBarang] = useState(true);
    const [currentDataBarang, setCurrentDataBarang] = useState({});
    const [loadCurrentDataBarang, setLoadCurrentDataBarang] = useState(true);
    const [buttonSubmitName, setButtonSubmitName] = useState('Submit');
    const [buttonVisibility, setButtonVisibility] = useState('d-inline');
    const [modalTitle, setModalTitle] = useState('Tambah Data');
    const [color, setColor] = useState('success');
    const [formDisabled, setFormDisabled] = useState(false);
    const [input, setInput] = useState({
        nama_barang: '',
        harga_retail: ''
    });
    const [details, setDetails] = useState([]);

    const toggleDetails = (index) => {
        const position = details.indexOf(index)
        let newDetails = details.slice()
        if (position !== -1) {
            newDetails.splice(position, 1)
        } else {
            newDetails = [...details, index]
        }
        setDetails(newDetails)
    }

    const changeHandler = e => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const closeModalHandler = () => {
        setSuccess(!success);
        setButtonSubmitName('Submit');
        setButtonVisibility('d-inline');
        setModalTitle('Tambah Data');
        setColor('success');
        setFormDisabled(false);
        setInput({
            nama_barang: '',
            harga_retail: ''    
        });
    }

    const submitHandler = action => {
        if(action === 'submit') {
            postDataBarang();
        } else if(action === 'update') {
            updateDataBarang(currentDataBarang.id);
        }
    }

    const getDataBarang = async () => {
        await axios.get(`${baseUrl}/data-barang`, {
            headers: {
                'Accept': 'Application/json',
                'Authorization': `Bearer ${localStorage.getItem('app-token')}`
            }
        })
        .then(response => {
            setDataBarang(response.data.result);
        })
        .catch(error => {
            console.log(error);
        });

        setLoadDataBarang(false);
    }

    const getDataBarangById = async (id, actionModal) => {
        await axios.get(`${baseUrl}/data-barang/${id}`, {
            headers: {
                'Accept': 'Application/json',
                'Authorization': `Bearer ${localStorage.getItem('app-token')}`
            }
        })
        .then(response => {
            const result = response.data.result;
            setCurrentDataBarang(result);
            setInput({ nama_barang: result.nama_barang });
        })
        .catch(error => {
            console.log(error);
        });

        setLoadCurrentDataBarang(false);

        if(actionModal === 'update') {
            setSuccess(!success);
            setButtonSubmitName('Update');
            setButtonVisibility('d-inline');
            setModalTitle('Update Data');
            setColor('success');  
            setFormDisabled(false);
        } else if(actionModal === 'view') {
            setSuccess(!success);
            setButtonSubmitName('Submit');
            setButtonVisibility('d-none');
            setModalTitle('Data');
            setColor('info');    
            setFormDisabled(true);
        } else if(actionModal === 'delete') {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteDataBarang(id);
                }
            })
        }
    }

    const postDataBarang = async () => {
        let harga_retail;
        if(input.harga_retail != currentDataBarang.harga_retail) {
            if(input.harga_retail.indexOf(',') !== -1 || input.harga_retail.indexOf('.') !== -1) {
                harga_retail = input.harga_retail.replace(/[^0-9]+/g, "");
            } else {
                harga_retail = input.harga_retail;
            }
        } else {
            harga_retail = input.harga_retail;
        }

        await axios.post(`${baseUrl}/data-barang`, {
            nama_barang: input.nama_barang,
            harga_retail: harga_retail
        },
        {
            headers: {
                'Accept': 'Application/json',
                'Authorization': `Bearer ${localStorage.getItem('app-token')}`
            }
        })
        .then(response => {
            Swal.fire(
                'Berhasil',
                response.data.message,
                'success'
            );

            getDataBarang();
        })
        .catch(error => {
            Swal.fire(
                'Gagal',
                error.message,
                'error'
            );
        });

        closeModalHandler();
    }

    const updateDataBarang = async id => {
        let harga_retail;
        if(input.harga_retail != currentDataBarang.harga_retail) {
            if(input.harga_retail.indexOf(',') !== -1 || input.harga_retail.indexOf('.') !== -1) {
                harga_retail = input.harga_retail.replace(/[^0-9]+/g, "");
            } else {
                harga_retail = input.harga_retail;
            }
        } else {
            harga_retail = input.harga_retail;
        }

        await axios.put(`${baseUrl}/data-barang/${id}`, {
            nama_barang: input.nama_barang,
            harga_retail: harga_retail
        },
        {
            headers: {
                'Accept': 'Application/json',
                'Authorization': `Bearer ${localStorage.getItem('app-token')}`
            }
        })
        .then(response => {
            Swal.fire(
                'Berhasil',
                response.data.message,
                'success'
            );

            getDataBarang();
        })
        .catch(error => {
            Swal.fire(
                'Gagal',
                error.message,
                'error'
            );
        });

        closeModalHandler();
    }

    const deleteDataBarang = async id => {
        await axios.delete(`${baseUrl}/data-barang/${id}`, {
            headers: {
                'Accept': 'Application/json',
                'Authorization': `Bearer ${localStorage.getItem('app-token')}`
            }
        })
        .then(response => {
            Swal.fire(
                'Berhasil',
                response.data.message,
                'success'
            );

            getDataBarang();
        })
        .catch(error => {
            Swal.fire(
                'Gagal',
                error.message,
                'error'
            );
        });
    }

    return {
        fields,
        success, setSuccess,
        dataBarang,
        loadDataBarang,
        currentDataBarang,
        loadCurrentDataBarang,
        buttonSubmitName,
        buttonVisibility,
        modalTitle,
        color,
        formDisabled,
        input,
        details,
        toggleDetails,
        changeHandler,
        closeModalHandler,
        submitHandler,
        getDataBarang,
        getDataBarangById,
    }
}

export default DataBarangHelper;