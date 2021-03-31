import { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const RecordPenjualanHelper = () => {
    const baseUrl = process.env.REACT_APP_LARAVEL_URL;
    const fields = [
        {
            key: 'id',
            label: 'No',
            _style: { textAlign: 'center' },
        },
        {
            key: 'nama',
            label: 'Nama',
            _style: { textAlign: 'center' },
        },
        {
            key: 'area',
            label: 'Area',
            _style: { textAlign: 'center' },
        },
        {
            key: 'kategori_pembelian',
            label: 'Kategori',
            _style: { textAlign: 'center' },
        },
        {
            key: 'kunjungan',
            label: 'Call',
            _style: { textAlign: 'center' },
        },
        {
            key: 'kunjungan_efektif',
            label: 'EC',
            _style: { textAlign: 'center' },
        },
        {
            key: 'nominal',
            label: 'Nominal',
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
    const [info, setInfo] = useState(false);
    const [openModalBarang, setOpenModalBarang] = useState(false);
    const [cetakLaporanModal, setCetakLaporanModal] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    const [dataRecordPenjualan, setDataRecordPenjualan] = useState([]);
    const [loadDataRecordPenjualan, setLoadDataRecordPenjualan] = useState(true);
    const [currentDataRecordPenjualan, setCurrentDataRecordPenjualan] = useState({});
    const [loadCurrentDataRecordPenjualan, setLoadCurrentDataRecordPenjualan] = useState(true);
    const [dataSales, setDataSales] = useState([]);
    const [dataBarang, setDataBarang] = useState([]);
    const [dataKategori, setDataKategori] = useState([]);
    const [loadDataKategori, setLoadDataKategori] = useState(false);
    const [buttonSubmitName, setButtonSubmitName] = useState('Submit');
    const [buttonVisibility, setButtonVisibility] = useState('d-inline');
    const [modalTitle, setModalTitle] = useState('Tambah Data');
    const [input, setInput] = useState({
        user_id: '',
        area: '',
        id_kategori_pembelian: '',
        kunjungan: '',
        kunjungan_efektif: '',
        nominal: ''
    });
    const [currentSales, setCurrentSales] = useState({ name: '' });
    const [inputBarang, setInputBarang] = useState([
        {id_record_penjualan: '', id_barang: '', nama_barang: '', jumlah: 0, harga: '', nominal: ''}
    ]);
    const [inputLaporan, setInputLaporan] = useState({ id_sales: '', dari: '', sampai: '' });
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

    const laporanChangeHandler = e => {
        setInputLaporan({ ...inputLaporan, [e.target.name]: e.target.value });
    }

    const closeModalHandler = action => {
        if(action === 'submit' || action === 'update') {
            setSuccess(!success);
        } else if(action === 'view') {
            setInfo(!info);
        } else if(action === 'tambah barang') {
            setOpenModalBarang(false);
        } else if(action === 'cetak laporan') {
            setCetakLaporanModal(!cetakLaporanModal);
        }

        setButtonSubmitName('Submit');
        setButtonVisibility('d-inline');
        setModalTitle('Tambah Data');
        setInput({
            user_id: '',
            area: '',
            id_kategori_pembelian: '',
            kunjungan: '',
            kunjungan_efektif: '',
            nominal: ''
        });
        setCurrentSales({ name: '' });
        setInputBarang([{id_record_penjualan: '', id_barang: '', nama_barang: '', jumlah: 0, harga: '', nominal: ''}]);
        setInputLaporan({ id_sales: '', dari: '', sampai: '' });
    }

    const submitHandler = action => {
        if(action === 'submit') {
            postDataRecordPenjualan();
        } else if(action === 'update') {
            updateDataRecordPenjualan(currentDataRecordPenjualan.id);
        } else if(action === 'tambah barang') {
            postListBarang(inputBarang);
        } else if(action === 'cetak laporan') {
            cetakLaporan();
        }
    }

    const getCurrentUser = async () => {
        await axios.get(`${baseUrl}/user/my/profile`, {
            headers: {
                'Accept': 'Application/json',
                'Authorization': `Bearer ${localStorage.getItem('app-token')}`
            }
        })
        .then(response => {
            const result = response.data.result;
            
            if(result.hak_akses === 'administrator') {
                getDataRecordPenjualan(`${baseUrl}/record-penjualan`);
            } else if(result.hak_akses === 'sales') {
                getDataRecordPenjualan(`${baseUrl}/record-penjualan/user/${result.id}`);
            }

            setCurrentUser(result);
        })
        .catch(error => {
            console.log(error);
        });
    }

    const getDataRecordPenjualan = async url => {
        await axios.get(url, {
            headers: {
                'Accept': 'Application/json',
                'Authorization': `Bearer ${localStorage.getItem('app-token')}`
            }
        })
        .then(response => {
            setDataRecordPenjualan(response.data.result);
        })
        .catch(error => {
            console.log(error);
        });

        setLoadDataRecordPenjualan(false);
    }

    const getDataRecordPenjualanById = async (id, actionModal) => {
        await axios.get(`${baseUrl}/record-penjualan/${id}`, {
            headers: {
                'Accept': 'Application/json',
                'Authorization': `Bearer ${localStorage.getItem('app-token')}`
            }
        })
        .then(response => {
            const result = response.data.result;
            setCurrentDataRecordPenjualan(result);

            if(actionModal === 'update') {
                setInput({
                    user_id: result.user_id,
                    area: result.area,
                    id_kategori_pembelian: result.id_kategori_pembelian,
                    kunjungan: result.kunjungan,
                    kunjungan_efektif: result.kunjungan_efektif,
                    nominal: result.nominal,
                });

                setCurrentSales({ name: result.user.name });
            } else if(actionModal === 'tambah barang') {
                setInputBarang([{
                    id_record_penjualan: result.id, 
                    id_barang: '', 
                    nama_barang: '', 
                    jumlah: 0,
                    harga: '',
                    nominal: ''
                }]);
            }
        })
        .catch(error => {
            console.log(error);
        });

        setLoadCurrentDataRecordPenjualan(false);

        if(actionModal === 'update') {
            setSuccess(!success);
            setButtonSubmitName('Update');
            setButtonVisibility('d-inline');
            setModalTitle('Update Data');
        } else if(actionModal === 'view') {
            setInfo(!info);
            setButtonSubmitName('Submit');
            setButtonVisibility('d-none');
            setModalTitle('Data');
        } else if(actionModal === 'tambah barang') {
            setOpenModalBarang(!openModalBarang);
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
                    deleteDataRecordPenjualan(id);
                }
            });
        }
    }

    const getAllSales = async () => {
        await axios.get(`${baseUrl}/user/role/sales`, {
            headers: {
                'Accept': 'Application/json',
                'Authorization': `Bearer ${localStorage.getItem('app-token')}`
            }
        })
        .then(response => {
            setDataSales(response.data.result);
        })
        .catch(error => {
            console.log(error);
        });
    }

    const getAllBarang = async () => {
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
    }

    const getKategoriPembelian = async () => {
        await axios.get(`${baseUrl}/kategori-pembelian`, {
            headers: {
                'Accept': 'Application/json',
                'Authorization': `Bearer ${localStorage.getItem('app-token')}`
            }
        })
        .then(response => {
            setDataKategori(response.data.result);
        })
        .catch(error => {
            console.log(error);
        });

        setLoadDataKategori(false);
    }

    const postDataRecordPenjualan = async () => {
        await axios.post(`${baseUrl}/record-penjualan`, {
            user_id: input.user_id,
            area: input.area,
            id_kategori_pembelian: input.id_kategori_pembelian,
            kunjungan: input.kunjungan,
            kunjungan_efektif: input.kunjungan_efektif,
        },
        {
            headers: {
                'Accept': 'Application/json',
                'Authorization': `Bearer ${localStorage.getItem('app-token')}`
            }
        })
        .then(response => {
            if(currentUser.hak_akses === 'administrator') {
                getDataRecordPenjualan(`${baseUrl}/record-penjualan`);
            } else if(currentUser.hak_akses === 'sales') {
                getDataRecordPenjualan(`${baseUrl}/record-penjualan/user/${currentUser.id}`);
            }

            Swal.fire(
                'Berhasil',
                response.data.message,
                'success'
            );
        })
        .catch(error => {
            Swal.fire(
                'Gagal',
                error.message,
                'error'
            );
        });

        closeModalHandler('submit');
    }

    const postListBarang = async payload => {
        let arr = [];
        payload.map(item => {
            arr.push(item.nominal);
        });
        let nominal = arr.reduce((a, b) => a + b, 0);

        await axios.post(`${baseUrl}/list-pembelian-barang`, {
            payload: payload
        }, 
        {
            headers: {
                'Accept': 'Application/json',
                'Authorization': `Bearer ${localStorage.getItem('app-token')}`
            }
        })
        .then(response => {
            updateNominalRecordPenjualan(currentDataRecordPenjualan.id, nominal);
        })
        .catch(error => {
            Swal.fire(
                'Gagal',
                error.message,
                'error'
            );
        });
    }

    const updateNominalRecordPenjualan = async (id, nominal) => {
        await axios.put(`${baseUrl}/record-penjualan/${id}`, {
            nominal: nominal
        },
        {
            headers: {
                'Accept': 'Application/json',
                'Authorization': `Bearer ${localStorage.getItem('app-token')}`
            }
        })
        .then(response => {
            if(currentUser.hak_akses === 'administrator') {
                getDataRecordPenjualan(`${baseUrl}/record-penjualan`);
            } else if(currentUser.hak_akses === 'sales') {
                getDataRecordPenjualan(`${baseUrl}/record-penjualan/user/${currentUser.id}`);
            }

            Swal.fire(
                'Berhasil',
                response.data.message,
                'success'
            );
        })
        .catch(error => {
            Swal.fire(
                'Gagal',
                error.message,
                'error'
            );
        });

        closeModalHandler('tambah barang');
    }

    const updateDataRecordPenjualan = async id => {
        await axios.put(`${baseUrl}/record-penjualan/${id}`, {
            user_id: input.user_id,
            area: input.area,
            id_kategori_pembelian: input.id_kategori_pembelian,
            kunjungan: input.kunjungan,
            kunjungan_efektif: input.kunjungan_efektif,
        },
        {
            headers: {
                'Accept': 'Application/json',
                'Authorization': `Bearer ${localStorage.getItem('app-token')}`
            }
        })
        .then(response => {
            if(currentUser.hak_akses === 'administrator') {
                getDataRecordPenjualan(`${baseUrl}/record-penjualan`);
            } else if(currentUser.hak_akses === 'sales') {
                getDataRecordPenjualan(`${baseUrl}/record-penjualan/user/${currentUser.id}`);
            }

            Swal.fire(
                'Berhasil',
                response.data.message,
                'success'
            );
        })
        .catch(error => {
            Swal.fire(
                'Gagal',
                error.message,
                'error'
            );
        });

        closeModalHandler('update');
    }

    const deleteDataRecordPenjualan = async id => {
        await axios.delete(`${baseUrl}/record-penjualan/${id}`, {
            headers: {
                'Accept': 'Application/json',
                'Authorization': `Bearer ${localStorage.getItem('app-token')}`
            }
        })
        .then(response => {
            if(currentUser.hak_akses === 'administrator') {
                getDataRecordPenjualan(`${baseUrl}/record-penjualan`);
            } else if(currentUser.hak_akses === 'sales') {
                getDataRecordPenjualan(`${baseUrl}/record-penjualan/user/${currentUser.id}`);
            }

            Swal.fire(
                'Berhasil',
                response.data.message,
                'success'
            );
        })
        .catch(error => {
            Swal.fire(
                'Gagal',
                error.message,
                'error'
            );
        });
    }

    const deleteListPembelianBarang = async id => {
        await axios.delete(`${baseUrl}/list-pembelian-barang/${id}`, {
            headers: {
                'Accept': 'Application/json',
                'Authorization': `Bearer ${localStorage.getItem('app-token')}`
            }
        })
        .then(response => {
            updateNominalRecordPenjualan(id, null);
        })
        .catch(error => {
            Swal.fire(
                'Gagal',
                error.message,
                'error'
            );
        });
    }

    const cetakLaporan = () => {
        let sampai;
        if(inputLaporan.sampai == '') {
            sampai = inputLaporan.dari;
        }

        window.open(`${process.env.REACT_APP_PUBLIC_URL}/laporan/record-penjualan/${inputLaporan.id_sales}/${inputLaporan.dari}/${sampai}`, '_blank');
    }

    return {
        fields,
        success, setSuccess,
        info,
        openModalBarang, setOpenModalBarang,
        cetakLaporanModal, setCetakLaporanModal,
        dataRecordPenjualan,
        loadDataRecordPenjualan,
        currentDataRecordPenjualan,
        loadCurrentDataRecordPenjualan,
        dataSales,
        dataBarang,
        dataKategori,
        loadDataKategori,
        buttonSubmitName,
        buttonVisibility,
        modalTitle,
        input, setInput,
        inputLaporan, setInputLaporan,
        inputBarang, setInputBarang,
        currentSales, setCurrentSales,
        details,
        toggleDetails,
        changeHandler,
        laporanChangeHandler,
        closeModalHandler,
        submitHandler,
        getCurrentUser,
        getDataRecordPenjualanById,
        getAllSales,
        getAllBarang,
        getKategoriPembelian,
        deleteListPembelianBarang,
        cetakLaporan
    }
}

export default RecordPenjualanHelper;