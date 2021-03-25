import { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const KategoriPembelianHelper = () => {
    const baseUrl = process.env.REACT_APP_LARAVEL_URL;
    const fields = [
        {
            key: 'id',
            label: 'No',
            _style: { textAlign: 'center' },
        },
        {
            key: 'nama',
            label: 'Nama Kategori',
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
    const [dataKategoriPembelian, setDataKategoriPembelian] = useState([]);
    const [loadDataKategoriPembelian, setLoadDataKategoriPembelian] = useState(true);
    const [currentDataKategoriPembelian, setCurrentDataKategoriPembelian] = useState({});
    const [loadCurrentDataKategoriPembelian, setLoadCurrentDataKategoriPembelian] = useState(true);
    const [buttonSubmitName, setButtonSubmitName] = useState('Submit');
    const [buttonVisibility, setButtonVisibility] = useState('d-inline');
    const [modalTitle, setModalTitle] = useState('Tambah Data');
    const [color, setColor] = useState('success');
    const [formDisabled, setFormDisabled] = useState(false);
    const [input, setInput] = useState({
        nama: ''
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
        setInput({ nama: '' });
    }

    const submitHandler = action => {
        if(action === 'submit') {
            postDataKategoriPembelian();
        } else if(action === 'update') {
            updateDataKategoriPembelian(currentDataKategoriPembelian.id);
        }
    }

    const getDataKategoriPembelian = async () => {
        await axios.get(`${baseUrl}/kategori-pembelian`, {
            headers: {
                'Accept': 'Application/json',
                'Authorization': `Bearer ${localStorage.getItem('app-token')}`
            }
        })
        .then(response => {
            setDataKategoriPembelian(response.data.result);
        })
        .catch(error => {
            console.log(error);
        });

        setLoadDataKategoriPembelian(false);
    }

    const getDataKategoriPembelianById = async (id, actionModal) => {
        await axios.get(`${baseUrl}/kategori-pembelian/${id}`, {
            headers: {
                'Accept': 'Application/json',
                'Authorization': `Bearer ${localStorage.getItem('app-token')}`
            }
        })
        .then(response => {
            const result = response.data.result;
            setCurrentDataKategoriPembelian(result);
            setInput({ nama: result.nama });
        })
        .catch(error => {
            console.log(error);
        });

        setLoadCurrentDataKategoriPembelian(false);

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
                    deleteDataKategoriPembelian(id);
                }
            })
        }
    }

    const postDataKategoriPembelian = async () => {
        await axios.post(`${baseUrl}/kategori-pembelian`, {
            nama: input.nama
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

            getDataKategoriPembelian();
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

    const updateDataKategoriPembelian = async id => {
        await axios.put(`${baseUrl}/kategori-pembelian/${id}`, {
            nama: input.nama
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

            getDataKategoriPembelian();
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

    const deleteDataKategoriPembelian = async id => {
        await axios.delete(`${baseUrl}/kategori-pembelian/${id}`, {
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

            getDataKategoriPembelian();
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
        dataKategoriPembelian,
        loadDataKategoriPembelian,
        currentDataKategoriPembelian,
        loadCurrentDataKategoriPembelian,
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
        getDataKategoriPembelian,
        getDataKategoriPembelianById,
    }
}

export default KategoriPembelianHelper;