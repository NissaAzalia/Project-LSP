/**
 * @typedef {object} catatan
 * @property {number} id - ID catatan
 * @property {string} nama - Nama pemesan
 * @property {number} noHp - Nomor HP pemesan
 * @property {string} deskripsi - Deskripsi pesanan
 * @property {number} dp - DP pesanan
 * @property {string} tglpesan - Tanggal pesan dalam format YYYY-MM-DD
 * @property {string} tglambil - Tanggal ambil pesanan dalam format YYYY-MM-DD
 * @property {string} status - Status pesanan (selesai atau belum selesai)
 * 
 */

/**
 * Elemen button
 */
const elSimpan = document.getElementById("btn-simpan");
const elCancel = document.getElementById("btn-cancel");
const search = document.getElementById("searchInput");
const sortByNameBtn = document.getElementById('sortByName');
const sortByTglpesanBtn = document.getElementById('sortByTglpesan');
const sortByTglambilBtn = document.getElementById('sortByTglambil');
const filterAll = document.getElementById("all")
const filterSelesai = document.getElementById("selesai")
const filterBlmselesai = document.getElementById("blmselesai")
const statusFilter = document.getElementById('statusFilter');

/**
 * Elemen data
 */
const inputNama = document.getElementById("nama");
const inputNohp = document.getElementById("noHp");
const inputDeskripsi = document.getElementById('deskripsi');
const inputDp = document.getElementById('dp');
const inputTglpesan = document.getElementById('tglpesan');
const inputTglambil = document.getElementById('tglambil');

/**
 * Elemen Popup
 */
const popup = document.getElementById("popup");
const popupClose = document.getElementById("close");
const popupSimpan = document.getElementById("popup-simpan");
const popupCancel = document.getElementById("popup-cancel");

/**
 * Elemen input pada Popup
 */
const popupNama = document.getElementById('popup-nama');
const popupNohp = document.getElementById('popup-noHp');
const popupDeskripsi = document.getElementById('popup-deskripsi');
const popupDp = document.getElementById('popup-dp');
const popupTglpesan = document.getElementById('popup-tglpesan');
const popupTglambil = document.getElementById('popup-tglambil');

/**
 * Daftar list
 */
const elItemsList = document.getElementById('list');

let updateIndex = null;

// localStorage
/**
 * @type {catatan[]}
 */
let listArray = JSON.parse(localStorage.getItem("listArray")) || [];


/**
 * Menyimpan catatan baru
 * @param {Event} event 
 */
elSimpan.addEventListener('click', (event) => {
    event.preventDefault();

    let num = 0;
    if(listArray.length == 0){
        num++;
    }else if(listArray.length > 0){
        num = listArray[listArray.length - 1].id + 1;
    }

    /**
     * @type {catatan}
     */
    const simpan = {
        id:num,
        nama: inputNama.value,
        noHp: inputNohp.value,
        deskripsi: inputDeskripsi.value,
        dp: inputDp.value,
        tglpesan: inputTglpesan.value,
        tglambil: inputTglambil.value,
        status: 'belum selesai'
    };

    // Validasi input kosong
    if (!simpan.nama || !simpan.noHp || !simpan.deskripsi || !simpan.tglpesan || !simpan.tglambil) {
        Swal.fire({
            position: "center",
            icon: "warning",
            title: "Input Kosong Wajib Diisi !",
            showConfirmButton: false,
            timer: 1500
        });
        return;
    }

    if (updateIndex != null) {
        listArray[updateIndex] = simpan;
        updateIndex = null;
    } else {
        listArray.push(simpan);
    }

    initialize();
    saveToLocalStorage();

    inputNama.value = '';
    inputNohp.value = '';
    inputDeskripsi.value = '';
    inputDp.value = '';
    inputTglpesan.value = '';
    inputTglambil.value = '';

    // Menampilkan alert berhasil disimpan menggunakan SweetAlert
    Swal.fire({
        icon: 'success',
        title: 'Berhasil disimpan!',
        showConfirmButton: false,
        timer: 1500 // Durasi alert ditampilkan (dalam milidetik)
    });

    console.log(listArray)
});


/**
 * Mengkosongkan formulir input
 * @param {Event} event
 */
elCancel.addEventListener('click', (event) => {
    event.preventDefault();
    inputNama.value = '';
    inputNohp.value = '';
    inputDeskripsi.value = '';
    inputDp.value = '';
    inputTglpesan.value = '';
    inputTglambil.value = '';

     // Menampilkan alert berhasil disimpan menggunakan SweetAlert
     Swal.fire({
        icon: 'success',
        title: 'Form mu sudah bersih!',
        showConfirmButton: false,
        timer: 1500 // Durasi alert ditampilkan (dalam milidetik)
    });

    updateIndex = null;
});


/**
 *  Inisialisasi tampilan daftar catatan saat halaman dimuat.
 * @returns {void}
 */
const initialize = () => {
    displayList(listArray);
};

/**
 * Menampilkan daftar catatan
 * @param {catatan[]} array - Array yang berisi daftar  catatan
 * @returns {void}
 */
const displayList = (array) => {
    elItemsList.innerHTML = "";
    array.forEach((item, idx) => {
        let itemClass = "item"; // Kelas utama untuk setiap item

        // Menentukan kelas tambahan berdasarkan indeks
        if (idx % 4 === 0 || idx % 4 === 3) {
            itemClass += " yellow"; // Kuning untuk indeks 0, 2, 4, ...
        } else {
            itemClass += " green"; // Hijau untuk indeks 1, 3, 5, ...
        }
        elItemsList.innerHTML += `
            <div class="${itemClass}">
                <div class="atas">
                    <span><b>${item.nama}</b></span>
                    <span>${item.noHp}</span>
                </div>
                <div class="border"></div>
                <div class="keterangan">
                    <span>Deskripsi: <b>${item.deskripsi}</b></span>
                    <span>Dp: <b>Rp. ${Number(item.dp).toLocaleString()}</b></span>
                    <span>Tanggal Pesan: <b>${item.tglpesan}</b></span>
                    <span>Tanggal Ambil: <b>${item.tglambil}</b></span>
                    <span>Status: <b>${item.status}</b></span>
                </div>
                <div class="border"></div>
                <div class="bawah">
                    <div class="icon id="btn-update" onClick="updateHandler(${item.id})">
                        <i class="fa-solid fa-pen-to-square fa-2xl"></i>
                    </div>
                    <div class="icon id="btn-delete" onClick="deleteHandler(${item.id})">
                        <i class="fa-solid fa-trash-can fa-2xl"></i>
                    </div>
                    <div class="check id="btn-status" onClick="statusHandler(${item.id})">
                        <i class="fa-solid fa-square-check fa-2xl"></i>
                    </div>
                </div>
            </div>`;
    });
};



/**
 * Menghapus catatan berdasarkan indeks
 * @param {number} id - ID catatan yang akan dihapus
 * @returns {void}
 */
const deleteHandler = (id) => {

    const data = listArray.filter(val => val.id !== id)
    Swal.fire({
        title: 'Anda yakin?',
        text: "Anda akan menghapus item ini!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            listArray= data;
            saveToLocalStorage();
            initialize();
            Swal.fire(
                'Terhapus!',
                'Item telah berhasil dihapus.',
                'success'
            );
        }
    });
};


/**
 * Memperbarui catatan berdasarkan indeks
 * @param {number} id - ID catatan yang akan diperbarui
 * @returns {void}
 */
const updateHandler = (id) => {
    const idData = listArray.find(val=> val.id == id);
    updateIndex = id;

    // Mengisi nilai input popup dengan data yang akan diupdate
    popupNama.value = idData.nama;
    popupNohp.value = idData.noHp;
    popupDeskripsi.value = idData.deskripsi;
    popupDp.value = idData.dp;
    popupTglpesan.value = idData.tglpesan;
    popupTglambil.value = idData.tglambil;

    
    popup.style.display = 'block'; // Menampilkan popup
};

/**
 * Mengganti status catatan menjadi 'selesai'
 * @param {number} id  - ID catatan yang akan diubah statusnya
 * @returns {void}
 */
const statusHandler = (id) => {

    const data = listArray.find(val => val.id == id)
    if (data.status === 'belum selesai') {
        data.status = 'selesai';
    } else if  (data.status === 'selesai') {
        return
    }

    // Menampilkan alert berhasil disimpan menggunakan SweetAlert
    Swal.fire({
        icon: 'success',
        title: 'pesanan selesai!',
        showConfirmButton: false,
        timer: 1500 // Durasi alert ditampilkan (dalam milidetik)
    });
    saveToLocalStorage();
    initialize();
};

/**
 * Filter catatan berdasarkan status
 * @param {string} status 
 */
const filterByStatus = (status) => {
    let filteredArray = listArray;

    if (status === 'selesai') {
        filteredArray = listArray.filter(item => item.status === 'selesai');
    } else if (status === 'belum selesai') {
        filteredArray = listArray.filter(item => item.status === 'belum selesai');
    }

    displayList(filteredArray);
};

filterAll.addEventListener(`click`, ()=>{
    displayList(listArray);
})

filterSelesai.addEventListener('click', () => {
    filterByStatus('selesai');
});

filterBlmselesai.addEventListener(`click`, ()=>{
    filterByStatus('belum selesai')
})



/**
 * Urutkan catatan berdasarkan nama
 */
sortByNameBtn.addEventListener('click', () => {
    listArray.sort((a, b) => a.nama.localeCompare(b.nama));
    initialize();
});

/**
 * Urutkan catatan berdasarkan tanggal pesan
 */
sortByTglpesanBtn.addEventListener('click', () => {
    listArray.sort((a, b) => new Date(a.tglpesan) - new Date(b.tglpesan));
    initialize();
});

/**
 * Urutan catatan berrdasarkan tanggal ambil
 */
sortByTglambilBtn.addEventListener('click', () => {
    listArray.sort((a, b) => new Date(a.tglambil) - new Date(b.tglambil));
    initialize();
});


/**
 * Mencari dan menampilkan item berdasarkan kata kunci yang dimasukkan pengguna
 */
search.addEventListener("input", () => {
    const keyword = search.value.toLowerCase(); // mendapat nilai input

    // menampilkan sesuai inputan
    const filteredItems = listArray.filter(item => {
        return (
            item.nama.toLowerCase().includes(keyword) ||
            item.deskripsi.toLowerCase().includes(keyword)
        );
    });

    displayList(filteredItems);
});

/**
 * Menutup Popup ketika button close diklik
 */
popupClose.addEventListener('click', () => {
    popup.style.display = 'none';
});

// simpan data dari popup
/**
 * Menyimpan perubahan pada catatan yang diupdate melalui popup
 * @param {Event} event 
 * @returns {void}
 */
popupSimpan.addEventListener('click', (event) => {
    event.preventDefault();

    
    const simpan = {
        id: updateIndex,
        nama: popupNama.value,
        noHp: popupNohp.value,
        deskripsi: popupDeskripsi.value,
        dp: popupDp.value,
        tglpesan: popupTglpesan.value,
        tglambil: popupTglambil.value,
        status: listArray.find(val => val.id === updateIndex)?.status || 'belum selesai'
    };

    if (updateIndex != null) {
        listArray = listArray.map(item => item.id === updateIndex ? simpan : item);
        updateIndex = null;
    }
    initialize();
    saveToLocalStorage();

    popup.style.display = 'none'; // Menutup popup setelah menyimpan

    popupNama.value = '';
    popupNohp.value = '';
    popupDeskripsi.value = '';
    popupDp.value = '';
    popupTglpesan.value = '';
    popupTglambil.value = '';

    Swal.fire({
        icon: 'success',
        title: 'Berhasil disimpan!',
        showConfirmButton: false,
        timer: 1500 // Durasi alert ditampilkan (dalam milidetik)
    });
});


/**
 * 
 * Mengkososngkan nilai Popup ketika pengguna membatalkan
 */
popupCancel.addEventListener('click', (event) => {
    event.preventDefault();
    popupNama.value = '';
    popupNohp.value = '';
    popupDeskripsi.value = '';
    popupDp.value = '';
    popupTglpesan.value = '';
    popupTglambil.value = '';

    

    updateIndex = null;
    popup.style.display = 'none';
});

/**
 * Menyimpan listArray ke dalam localStorage setiap kali ada perubahan.
 */
const saveToLocalStorage = () => {
    localStorage.setItem('listArray', JSON.stringify(listArray));
};

initialize();
