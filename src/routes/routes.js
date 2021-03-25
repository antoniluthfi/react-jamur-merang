import { lazy } from 'react';

const Dashboard = lazy(() => import('../views/dashboard/Dashboard'));
const DataBarang = lazy(() => import('../views/administrator/data-barang/DataBarang'));
const KategoriPembelian = lazy(() => import('../views/administrator/kategori-pembelian/KategoriPembelian'));
const DataAdministrator = lazy(() => import('../views/administrator/data-karyawan/DataAdministrator'));
const DataSales = lazy(() => import('../views/administrator/data-karyawan/DataSales'));

const RecordPenjualan = lazy(() => import('../views/administrator/record-penjualan/RecordPenjualan'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },

  { path: '/master-data', name: 'Master Data', exact: true },
  { path: '/master-data/data-barang', name: 'Data Barang', component: DataBarang },
  { path: '/master-data/kategori-pembelian', name: 'Kategori Pembelian', component: KategoriPembelian },

  { path: '/master-data/karyawan', name: 'Karyawan', exact: true },
  { path: '/master-data/karyawan/data-administrator', name: 'Data Administrator', component: DataAdministrator },
  { path: '/master-data/karyawan/data-sales', name: 'Data Sales', component: DataSales },

  { path: '/record-penjualan', name: 'Record Penjualan', component: RecordPenjualan }
];

export default routes;
