import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faTachometerAlt,
    faCodeBranch,
    faFolder,
    faFileAlt,
    faAddressCard,
    faLongArrowAltRight
} from '@fortawesome/free-solid-svg-icons'

const administratorNavigation =  [
    {
        _tag: 'CSidebarNavItem',
        name: 'Dashboard',
        to: '/dashboard',
        icon: <FontAwesomeIcon icon={faTachometerAlt} className="mr-3 ml-2" />,
        badge: {
            color: 'info',
            text: 'NEW',
        }
    },
    {
        _tag: 'CSidebarNavDropdown',
        name: 'Master Data',
        route: '/master-data',
        icon: <FontAwesomeIcon icon={faFolder} className="mr-3 ml-2" />,
        _children: [
            {
                _tag: 'CSidebarNavDropdown',
                name: 'Karyawan',
                icon: <FontAwesomeIcon icon={faAddressCard} className="mr-2" />,
                route: '/master-data/karyawan',
                _children: [
                    {
                        _tag: 'CSidebarNavItem',
                        name: 'Data Administrator',
                        icon: <FontAwesomeIcon icon={faLongArrowAltRight} className="mr-2 ml-3" />,
                        to: '/master-data/karyawan/data-administrator',
                    },    
                    {
                        _tag: 'CSidebarNavItem',
                        name: 'Data Sales',
                        icon: <FontAwesomeIcon icon={faLongArrowAltRight} className="mr-2 ml-3" />,
                        to: '/master-data/karyawan/data-sales',
                    },    
                ]
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'Data Barang',
                icon: <FontAwesomeIcon icon={faFileAlt} className="mr-2" />,
                to: '/master-data/data-barang',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'Kategori Pembelian',
                icon: <FontAwesomeIcon icon={faCodeBranch} className="mr-2" />,
                to: '/master-data/kategori-pembelian',
            },      
        ]
    },
    {
        _tag: 'CSidebarNavItem',
        name: 'Record Penjualan',
        icon: <FontAwesomeIcon icon={faFileAlt} className="mr-3 ml-2" />,
        to: '/record-penjualan',
    },
]

export default administratorNavigation
