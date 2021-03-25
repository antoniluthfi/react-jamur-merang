import { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const DataAdministratorHelper = () => {
    const baseUrl = process.env.REACT_APP_LARAVEL_URL;
    const fields = [
        {
            key: 'id',
            label: 'No',
            _style: { textAlign: 'center' },
        },
        {
            key: 'name',
            label: 'Nama',
            _style: { textAlign: 'center' },
        },
        {
            key: 'email',
            label: 'Email',
            _style: { textAlign: 'center' },
        },
        {
            key: 'hak_akses',
            label: 'Jabatan',
            _style: { textAlign: 'center' },
        },
        {
            key: 'nomorhp',
            label: 'Nomor HP',
            _style: { textAlign: 'center' },
        },
        {
            key: 'alamat',
            label: 'Alamat',
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
    const [dataAdministrator, setDataAdministrator] = useState([]);
    const [loadDataAdministrator, setLoadDataAdministrator] = useState(true);
    const [currentDataAdministrator, setCurrentDataAdministrator] = useState({});
    const [loadCurrentDataAdministrator, setLoadCurrentDataAdministrator] = useState(true);
    const [buttonSubmitName, setButtonSubmitName] = useState('Submit');
    const [buttonVisibility, setButtonVisibility] = useState('d-inline');
    const [modalTitle, setModalTitle] = useState('Tambah Data');
    const [color, setColor] = useState('success');
    const [formDisabled, setFormDisabled] = useState(false);
    const [input, setInput] = useState({
        name: '',
        email: '',
        password: '',
        hak_akses: 'administrator',
        nomorhp: '',
        alamat: ''
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
            name: '',
            email: '',
            password: '',
            hak_akses: 'sales',
            nomorhp: '',
            alamat: ''    
        });
    }

    const submitHandler = action => {
        if(action === 'submit') {
            postDataAdministrator();
        } else if(action === 'update') {
            updateDataAdministrator(currentDataAdministrator.id);
        }
    }

    const getDataAdministrator = async () => {
        await axios.get(`${baseUrl}/user/role/administrator`, {
            headers: {
                'Accept': 'Application/json',
                'Authorization': `Bearer ${localStorage.getItem('app-token')}`
            }
        })
        .then(response => {
            setDataAdministrator(response.data.result);
        })
        .catch(error => {
            console.log(error);
        });

        setLoadDataAdministrator(false);
    }

    const getDataAdministratorById = async (id, actionModal) => {
        await axios.get(`${baseUrl}/user/${id}`, {
            headers: {
                'Accept': 'Application/json',
                'Authorization': `Bearer ${localStorage.getItem('app-token')}`
            }
        })
        .then(response => {
            const result = response.data.result;
            setCurrentDataAdministrator(result);
            setInput({ nama: result.nama });
        })
        .catch(error => {
            console.log(error);
        });

        setLoadCurrentDataAdministrator(false);

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
                    deleteDataAdministrator(id);
                }
            })
        }
    }

    const postDataAdministrator = async () => {
        await axios.post(`${baseUrl}/user`, {
            name: input.name,
            email: input.email,
            password: input.name,
            hak_akses: input.hak_akses,
            nomorhp: input.nomorhp,
            alamat: input.alamat    
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

            getDataAdministrator();
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

    const updateDataAdministrator = async id => {
        await axios.put(`${baseUrl}/user/${id}`, {
            name: input.name,
            email: input.email,
            password: input.name,
            hak_akses: input.hak_akses,
            nomorhp: input.nomorhp,
            alamat: input.alamat    
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

            getDataAdministrator();
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

    const deleteDataAdministrator = async id => {
        await axios.delete(`${baseUrl}/user/${id}`, {
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

            getDataAdministrator();
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
        dataAdministrator,
        loadDataAdministrator,
        currentDataAdministrator,
        loadCurrentDataAdministrator,
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
        getDataAdministrator,
        getDataAdministratorById,
    }
}

export default DataAdministratorHelper;