import React, { useEffect } from 'react';
import RecordPenjualanHelper from './modules/RecordPenjualanHelper';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CurrencyFormat from 'react-currency-format';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CRow,
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CForm,
    CFormGroup,
    CLabel,
    CInput,
    CModalFooter,
    CCollapse,
    CSelect
} from '@coreui/react';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const RecordPenjualan = () => {
    const {
        fields,
        success, setSuccess,
        info,
        openModalBarang,
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
    } = RecordPenjualanHelper();

    useEffect(() => {
        getCurrentUser();
        getAllSales();
        getAllBarang();
        getKategoriPembelian();
    }, [])

    return (
        <>
            <CRow>
                <CCol xs="12" lg="12">
                    <CCard>
                        <CCardHeader>Data Record Penjualan</CCardHeader>
                        <CRow>
                            <CCol xs="6" lg="6">
                                <CButton color="success" onClick={() => setSuccess(!success)} className="ml-3 mt-2">Tambah Data</CButton>
                                <CButton color="warning" onClick={() => setCetakLaporanModal(!cetakLaporanModal)} className="ml-1 mt-2">Cetak Laporan</CButton>
                            </CCol>
                        </CRow>
                        <CCardBody>
                            <CDataTable
                                items={dataRecordPenjualan}
                                fields={fields}
                                striped
                                sorter
                                hover
                                tableFilter
                                noItemsView={loadDataRecordPenjualan ? {noItems: 'Get data'} : {noResults: 'Not found', noItems: 'Empty'}}
                                loading={loadDataRecordPenjualan}    
                                itemsPerPageSelect
                                itemsPerPage={5}
                                pagination
                                scopedSlots = {{
                                    'id': 
                                    ((item, i) => <td className="text-center">{i + 1}</td>),
                                    'nama': 
                                    (item => <td>{item.user.name}</td>),
                                    'area':
                                    (item => <td>{item.area}</td>),
                                    'kategori_pembelian': 
                                    (item => <td className="text-center">{item.kategori_pembelian.nama}</td>),
                                    'kunjungan':
                                    (item => <td className="text-center">{item.kunjungan}</td>),
                                    'kunjungan_efektif':
                                    (item => <td className="text-center">{item.kunjungan_efektif}</td>),
                                    'nominal':
                                    (item => <td className="text-right">{item.nominal == null ? null : `Rp. ${new Intl.NumberFormat(['ban', 'id']).format(item.nominal)}`}</td>),
                                    'show_details':
                                    (item, index)=>{
                                        return (
                                        <td className="py-2">
                                            <CButton
                                                color="primary"
                                                variant="outline"
                                                shape="square"
                                                size="sm"
                                                onClick={()=>{toggleDetails(index)}}
                                            >
                                                {details.includes(index) ? 'Hide' : 'Show'}
                                            </CButton>
                                        </td>
                                        )
                                    },
                                    'details':
                                        (item, index)=>{
                                        return (
                                        <CCollapse show={details.includes(index)}>
                                            <CCardBody>
                                                <CButton size="sm" color="info" onClick={() => getDataRecordPenjualanById(item.id, 'view')}>
                                                    View Details
                                                </CButton>
                                                <CButton size="sm" color="success" className="ml-1" onClick={() => getDataRecordPenjualanById(item.id, 'update')}>
                                                    Update
                                                </CButton>
                                                {item.barang == null ? 
                                                    <CButton size="sm" color="warning" className="ml-1" onClick={() => getDataRecordPenjualanById(item.id, 'tambah barang')}>
                                                        Tambah Barang
                                                    </CButton> :
                                                    <CButton size="sm" color="danger" className="ml-1" onClick={() => deleteListPembelianBarang(item.id)}>
                                                        Hapus Barang
                                                    </CButton> 
                                                }
                                                <CButton size="sm" color="danger" className="ml-1" onClick={() => getDataRecordPenjualanById(item.id, 'delete')}>
                                                    Delete
                                                </CButton>         
                                            </CCardBody>
                                        </CCollapse>
                                        )
                                    }
                                }}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* add, edit data */}
            <CModal 
                show={success} 
                onClose={() => closeModalHandler(buttonSubmitName.toLowerCase())}
                color="success"
                closeOnBackdrop={false}
            >
                <CModalHeader closeButton>
                    <CModalTitle>{modalTitle}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm action="" method="post">
                        <CRow>
                            <CCol xs="12" md="12">
                                <CFormGroup>
                                    <CLabel htmlFor="input-sales">Nama Sales</CLabel>
                                    <Autocomplete
                                        id="input-sales"
                                        clearOnEscape={true}
                                        options={dataSales}
                                        getOptionSelected={(option, value) => option.id === value.id}
                                        getOptionLabel={option => option.name}
                                        value={{ name: currentSales.name }}
                                        onChange={(event, values) => {
                                            if(values !== null) {
                                                setCurrentSales({
                                                    ...currentSales, name: values.name
                                                });

                                                setInput({
                                                    ...input, user_id: values.id
                                                });
                                            } else {
                                                setCurrentSales({
                                                    ...currentSales, name: ''
                                                });

                                                setInput({
                                                    ...input, user_id: ''
                                                });
                                            }                
                                        }}
                                        renderInput={(params) => 
                                            <TextField {...params} />
                                        }
                                    />                                
                                </CFormGroup>
                            </CCol>
                        </CRow>

                        <CRow>
                            <CCol xs="12" md="6">
                                <CFormGroup>
                                    <CLabel htmlFor="area">Area</CLabel>
                                    <CInput type="text" name="area" id="area" value={input.area} onChange={changeHandler} placeholder="Masukkan Area" />
                                </CFormGroup>
                            </CCol>
                            <CCol xs="12" md="6">
                                <CLabel htmlFor="kategori-pembelian">Kategori Pembelian</CLabel>
                                <CSelect custom name="id_kategori_pembelian" id="kategori-pembelian" value={input.id_kategori_pembelian} onChange={changeHandler} >
                                    {loadDataKategori ? <option value="">Pilih Salah Satuh</option> :
                                        <>
                                            <option value="">Pilih Salah Satu</option>
                                            {dataKategori.map(item => (
                                                <option key={item.id} value={item.id}>{item.nama}</option>
                                            ))}
                                        </>
                                    }
                                </CSelect>
                            </CCol>
                        </CRow>

                        <CRow>
                            <CCol xs="12" md="6">
                                <CLabel htmlFor="panggilan">Kunjungan</CLabel>
                                <CInput type="number" min="1" name="kunjungan" id="panggilan" value={input.kunjungan} onChange={changeHandler} placeholder="Kunjungan" />
                            </CCol>
                            <CCol xs="12" md="6">
                                <CLabel htmlFor="kunjungan">Kunjungan Efektif</CLabel>
                                <CInput type="number" min="1" name="kunjungan_efektif" id="kunjungan" value={input.kunjungan_efektif} onChange={changeHandler} placeholder="Kunjungan Efektif" />
                            </CCol>
                        </CRow>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="success" className={buttonVisibility} onClick={() => submitHandler(buttonSubmitName.toLowerCase())}>{buttonSubmitName}</CButton>{' '}
                    <CButton color="secondary" className={buttonVisibility} onClick={() => closeModalHandler(buttonSubmitName.toLowerCase())}>Cancel</CButton>
                </CModalFooter>
            </CModal>

            {/* tambah data barang */}
            <CModal 
                show={openModalBarang} 
                onClose={() => closeModalHandler('tambah barang')}
                color="success"
                closeOnBackdrop={false}
            >
                <CModalHeader closeButton>
                    <CModalTitle>Tambah Barang</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol xs="12" md="12">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th className="text-center">No</th>
                                        <th className="text-center" style={{ width: '60%' }}>Nama Barang</th>
                                        <th className="text-center">Jumlah</th>
                                        <th className="text-center">
                                            <CButton size="sm" color="info" onClick={() => {
                                                setInputBarang([
                                                    ...inputBarang, 
                                                    {
                                                        id_record_penjualan: currentDataRecordPenjualan.id, 
                                                        id_barang: '', 
                                                        nama_barang: '', 
                                                        jumlah: 0,
                                                        harga: '',
                                                        nominal: ''
                                                    }
                                                ]);
                                            }}>
                                                <FontAwesomeIcon icon={faPlus} />
                                            </CButton>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inputBarang.map((item, i) => (
                                        <tr key={i}>
                                            <td className="text-center">{i + 1}</td>
                                            <td className="text-center">
                                                <CFormGroup>
                                                    <Autocomplete
                                                        id="input-barang"
                                                        name="id_barang"
                                                        clearOnEscape={true}
                                                        options={dataBarang}
                                                        getOptionSelected={(option, value) => option.id === value.id}
                                                        getOptionLabel={option => option.nama_barang}
                                                        value={{ nama_barang: inputBarang[i].nama_barang }}
                                                        onChange={(event, values) => {
                                                            if(values !== null) {
                                                                const val = [...inputBarang];
                                                                val[i].id_barang = values.id;
                                                                val[i].nama_barang = values.nama_barang;
                                                                val[i].harga = values.harga_retail;
                                                                setInputBarang(val);
                                                            } else {
                                                                const val = [...inputBarang];
                                                                val[i].id_barang = '';
                                                                val[i].nama_barang = '';
                                                                val[i].harga = '';
                                                                setInputBarang(val);
                                                            }                
                                                        }}
                                                        renderInput={(params) => 
                                                            <TextField {...params} />
                                                        }
                                                    />                                
                                                </CFormGroup>
                                            </td>
                                            <td className="text-center">
                                                <TextField type="number" min="1" name="jumlah" value={item.jumlah} onChange={e => {
                                                    const val = [...inputBarang];
                                                    val[i].jumlah = e.target.value;
                                                    val[i].nominal = val[i].jumlah * val[i].harga;
                                                    setInputBarang(val);
                                                }} />
                                            </td>
                                            <td className="text-center">
                                                <CButton size="sm" color="danger" onClick={() => {
                                                    const val = [...inputBarang];
                                                    val.splice(i, 1);
                                                    setInputBarang(val);
                                                }}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </CButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="success" onClick={() => submitHandler('tambah barang')}>Submit</CButton>{' '}
                    <CButton color="secondary" onClick={() => closeModalHandler('tambah barang')}>Cancel</CButton>
                </CModalFooter>
            </CModal>

            {/* cetak laporan */}
            <CModal 
                show={cetakLaporanModal} 
                onClose={() => closeModalHandler('cetak laporan')}
                color="success"
                closeOnBackdrop={false}
            >
                <CModalHeader closeButton>
                    <CModalTitle>Cetak Laporan</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol xs="12" md="12">
                            <CFormGroup>
                                <CLabel htmlFor="input-sales">Nama Sales</CLabel>
                                <Autocomplete
                                    id="input-sales"
                                    clearOnEscape={true}
                                    options={dataSales}
                                    getOptionSelected={(option, value) => option.id === value.id}
                                    getOptionLabel={option => option.name}
                                    value={{ name: currentSales.name }}
                                    onChange={(event, values) => {
                                        if(values !== null) {
                                            setCurrentSales({
                                                ...currentSales, name: values.name
                                            });

                                            setInputLaporan({
                                                ...inputLaporan, id_sales: values.id
                                            });
                                        } else {
                                            setCurrentSales({
                                                ...currentSales, name: ''
                                            });

                                            setInputLaporan({
                                                ...inputLaporan, id_sales: ''
                                            });
                                        }                
                                    }}
                                    renderInput={(params) => 
                                        <TextField {...params} />
                                    }
                                />                                
                            </CFormGroup>
                        </CCol>
                    </CRow>

                    <CRow>
                        <CCol xs="12" md="6">
                            <CLabel htmlFor="dari">Dari</CLabel>
                            <CInput type="date" name="dari" id="dari" value={inputLaporan.dari} onChange={laporanChangeHandler} />
                        </CCol>

                        <CCol xs="12" md="6">
                            <CLabel htmlFor="sampai">Sampai</CLabel>
                            <CInput type="date" name="sampai" id="sampai" value={inputLaporan.sampai} onChange={laporanChangeHandler} />
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="success" onClick={() => submitHandler('cetak laporan')}>Submit</CButton>{' '}
                    <CButton color="secondary" onClick={() => closeModalHandler('cetak laporan')}>Cancel</CButton>
                </CModalFooter>
            </CModal>

            {/* view data */}
            <CModal 
                show={info} 
                onClose={() => closeModalHandler('view')}
                color="info"
                closeOnBackdrop={false}
            >
                <CModalHeader closeButton>
                    <CModalTitle>View Data</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {loadCurrentDataRecordPenjualan ? null :
                        <>
                            <CRow>
                                <CCol xs="12" md="12">
                                    <CLabel htmlFor="nama-sales">Nama Sales</CLabel>
                                    <CInput type="text" name="sales" id="nama-sales" value={currentDataRecordPenjualan.user.name} disabled />
                                </CCol>
                            </CRow>  

                            <CRow>
                                <CCol xs="12" md="6">
                                    <CFormGroup>
                                        <CLabel htmlFor="area">Area</CLabel>
                                        <CInput type="text" name="area" id="area" value={currentDataRecordPenjualan.area} placeholder="Masukkan Area" disabled />
                                    </CFormGroup>
                                </CCol>
                                <CCol xs="12" md="6">
                                    <CLabel htmlFor="kategori-pembelian">Kategori Pembelian</CLabel>
                                    <CInput type="text" name="kategori_pembelian" id="kategori-pembelian" value={currentDataRecordPenjualan.kategori_pembelian.nama} placeholder="Masukkan Area" disabled />
                                </CCol>
                            </CRow>

                            <CRow>
                                <CCol xs="12" md="6">
                                    <CLabel htmlFor="panggilan">Kunjungan</CLabel>
                                    <CInput type="number" min="1" name="kunjungan" id="panggilan" value={currentDataRecordPenjualan.kunjungan} placeholder="Kunjungan" disabled />
                                </CCol>
                                <CCol xs="12" md="6">
                                    <CLabel htmlFor="kunjungan">Kunjungan Efektif</CLabel>
                                    <CInput type="number" min="1" name="kunjungan_efektif" id="kunjungan" value={currentDataRecordPenjualan.kunjungan_efektif} placeholder="Kunjungan Efektif" disabled />
                                </CCol>
                            </CRow><br/>

                            {currentDataRecordPenjualan.barang == null ? null : 
                                <CRow>
                                    <CCol xs="12" md="12">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th className="text-center">No</th>
                                                    <th className="text-center">Nama Barang</th>
                                                    <th className="text-center">Harga</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentDataRecordPenjualan.barang.map((item, i) => (
                                                    <tr key={i}>
                                                        <td className="text-center">{i + 1}</td>
                                                        <td className="text-center">{item.detail_barang.nama_barang}</td>
                                                        <td className="text-right">Rp. {new Intl.NumberFormat(['ban', 'id']).format(item.detail_barang.harga_retail * item.jumlah)}</td>
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <th className="text-center">#</th>
                                                    <th className="text-center">Total</th>
                                                    <th className="text-right">Rp. {new Intl.NumberFormat(['ban', 'id']).format(currentDataRecordPenjualan.nominal)}</th>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </CCol>
                                </CRow>
                            }
                        </>                  
                    }
                </CModalBody>
                <CModalFooter></CModalFooter>
            </CModal>
        </>
    )
}

export default RecordPenjualan;