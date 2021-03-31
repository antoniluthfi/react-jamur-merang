import React, { useEffect } from 'react';
import DataBarangHelper from './modules/DataBarangHelper';
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
} from '@coreui/react';  

const DataBarang = () => {
    const {
        fields,
        success, setSuccess,
        dataBarang,
        loadDataBarang,
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
    } = DataBarangHelper();

    useEffect(() => {
        getDataBarang();
    }, []);

    return (
        <>
            <CRow>
                <CCol xs="12" lg="12">
                    <CCard>
                        <CCardHeader>Data Barang</CCardHeader>
                        <CRow>
                            <CCol xs="6" lg="6">
                                <CButton color="success" onClick={() => setSuccess(!success)} className="ml-3 mt-2">Tambah Data</CButton>
                            </CCol>
                        </CRow>
                        <CCardBody>
                            <CDataTable
                                items={dataBarang}
                                fields={fields}
                                striped
                                sorter
                                hover
                                tableFilter
                                noItemsView={loadDataBarang ? {noItems: 'Get data'} : {noResults: 'Not found', noItems: 'Empty'}}
                                loading={loadDataBarang}    
                                itemsPerPageSelect
                                itemsPerPage={5}
                                pagination
                                scopedSlots = {{
                                    'id': 
                                    ((item, i) => <td className="text-center">{i + 1}</td>),
                                    'nama_barang':
                                    (item => <td className="text-center">{item.nama_barang}</td>),
                                    'harga_retail':
                                    (item => <td className="text-center">Rp. {new Intl.NumberFormat(['ban', 'id']).format(item.harga_retail)}</td>),
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
                                                <CButton size="sm" color="info" onClick={() => getDataBarangById(item.id, 'view')}>
                                                    View Details
                                                </CButton>
                                                <CButton size="sm" color="success" className="ml-1" onClick={() => getDataBarangById(item.id, 'update')}>
                                                    Update
                                                </CButton>
                                                <CButton size="sm" color="danger" className="ml-1" onClick={() => getDataBarangById(item.id, 'delete')}>
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
                onClose={closeModalHandler}
                color={color}
                closeOnBackdrop={false}
            >
                <CModalHeader closeButton>
                    <CModalTitle>{modalTitle}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm action="" method="post">
                        <CRow>
                            <CCol xs="12" md="6">
                                <CFormGroup>
                                    <CLabel htmlFor="nama-barang">Nama Barang</CLabel>
                                    <CInput type="text" name="nama_barang" id="nama-barang" value={input.nama_barang} onChange={changeHandler} placeholder="Masukkan Nama Barang" disabled={formDisabled} />
                                </CFormGroup>
                            </CCol>
                            <CCol xs="12" md="6">
                                <CFormGroup>
                                    <CLabel htmlFor="harga-retail">Harga Retail</CLabel>
                                    <CurrencyFormat thousandSeparator={true} prefix={'Rp.'} customInput={CInput} name="harga_retail" id="harga-retail" value={input.harga_retail} onChange={changeHandler} placeholder="Masukkan Harga" disabled={formDisabled} />
                                </CFormGroup>
                            </CCol>
                        </CRow>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="success" className={buttonVisibility} onClick={() => submitHandler(buttonSubmitName.toLowerCase())}>{buttonSubmitName}</CButton>{' '}
                    <CButton color="secondary" className={buttonVisibility} onClick={closeModalHandler}>Cancel</CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

export default DataBarang;