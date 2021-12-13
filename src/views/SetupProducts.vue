<template>
  <v-container
    id="setup-products-view"
    fluid
    tag="section"
  >
    <v-row justify="center">
      <v-col
        cols="12"
        md="12"
      >
        <material-card
          color="primary"
          icon="mdi-archive-outline"
        >
          <template #title>
            Tabel Produk
          </template>

          <v-data-table
            dense
            :headers="headers"
            :items="localDs"
            :items-per-page="5"
            :search="search"
            :custom-filter="searchByFilter"
            class="elevation-1 py-2"
          >
            <template v-slot:top>
              <v-toolbar
                flat
              >
                <v-text-field
                  v-model="search"
                  label="Search"
                  class="mx-4 my-2"
                />
                <v-dialog
                  v-model="dialog"
                  max-width="700px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      class="mb-2"
                      v-bind="attrs"
                      v-on="on"
                    >
                      New Item
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title class="primary">
                      <span class="white--text text-h5">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col
                            cols="12"
                            sm="12"
                            md="6"
                          >
                            <v-row class="d-flex align-center">
                              <v-col
                                cols="9"
                              >
                                <v-text-field
                                  v-model="editedItem.productCode"
                                  label="Barcode"
                                />
                              </v-col>
                              <v-col
                                cols="2"
                              >
                                <v-btn
                                  class="primary"
                                  text
                                  @click="sheet = !sheet"
                                >
                                  <v-icon>
                                    mdi-qrcode
                                  </v-icon>
                                </v-btn>
                              </v-col>
                            </v-row>
                            <!-- <v-text-field
                              v-model="editedItem.productCode"
                              label="Barcode"
                            />
                            <v-btn
                              class="primary"
                            >
                              Scan
                              <v-icon>
                                mdi-qrcode
                              </v-icon>
                            </v-btn> -->
                            <!-- <v-row>
                              <v-col
                                cols="12"
                              >
                                <small>Scan Barcode</small>
                                <br>
                                <small>
                                  {{ textBarcode }}
                                </small>
                              </v-col>
                              <v-col
                                cols="12"
                              >
                                <barcode-scanner @result="onScanSuccess" />
                              </v-col>
                            </v-row> -->
                          </v-col>
                          <v-col
                            cols="12"
                            sm="12"
                            md="12"
                          >
                            <v-text-field
                              v-model="editedItem.productName"
                              label="Nama Produk"
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            sm="12"
                            md="6"
                          >
                            <v-text-field
                              v-model="editedItem.productVendor"
                              label="Vendor"
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            sm="12"
                            md="6"
                          >
                            <v-text-field
                              v-model="editedItem.price"
                              type="number"
                              label="Harga"
                              prefix="Rp"
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            sm="12"
                            md="6"
                          >
                            <v-text-field
                              v-model="editedItem.quantityInStock"
                              type="number"
                              label="Quantity in Stock"
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            sm="12"
                            md="12"
                          >
                            <v-textarea
                              v-model="editedItem.productDescription"
                              label="Deskripsi"
                              auto-grow
                              rows="3"
                            />
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        color="primary"
                        text
                        @click="close"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        color="primary"
                        text
                        @click="save"
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog
                  v-model="dialogDelete"
                  max-width="400px"
                >
                  <v-card>
                    <v-card-title class="text-h5">
                      Are you sure you want to delete this product?
                    </v-card-title>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        color="primary"
                        text
                        @click="closeDelete"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        color="primary"
                        text
                        @click="deleteItemConfirm"
                      >
                        OK
                      </v-btn>
                      <v-spacer />
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.price="{ item }">
              {{ "Rp " + item.price }}
            </template>
            <template v-slot:item.productImage="{ item }">
              <v-img
                :src="urlImage + item.productImage"
                height="100"
                width="100"
              />
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                class="mr-2"
                small
                @click="deleteItem(item)"
              >
                mdi-delete
              </v-icon>
              <v-icon
                small
                @click="uploadImageItem(item)"
              >
                mdi-camera
              </v-icon>
            </template>
          </v-data-table>
          <v-bottom-sheet
            v-model="sheet"
            persistent
          >
            <v-sheet
              class="d-flex text-center align-center"
              height="200px"
            >
              <v-row>
                <v-col
                  cols="12"
                >
                  <small>
                    Scan Barcode
                  </small>
                </v-col>
                <v-col
                  cols="12"
                >
                  <barcode-scanner @result="onScanSuccess" />
                </v-col>
                <v-col
                  cols="12"
                >
                  <v-btn
                    text
                    color="error"
                    @click="sheet = !sheet"
                  >
                    close
                  </v-btn>
                </v-col>
              </v-row>
            </v-sheet>
          </v-bottom-sheet>
          <v-dialog
            v-model="dialogUpload"
            width="300"
            height="100"
          >
            <v-card>
              <v-container
                fluid
              >
                <v-row
                  class="d-flex align-center text-center"
                >
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                  >
                    <v-file-input
                      v-model="fileUploadImage"
                      :rules="rulesAvatar"
                      show-size
                      accept="image/png, image/jpeg"
                      placeholder="Pick an Profile image"
                      prepend-icon="mdi-camera"
                      label="Profile Image"
                    />
                  </v-col>
                  <v-col
                    v-if="loading"
                    cols="12"
                    sm="12"
                    md="12"
                  >
                    <v-progress-circular
                      indeterminate
                      color="primary"
                    />
                  </v-col>
                </v-row>
              </v-container>

              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="primary"
                  text
                  @click="dialogUpload = false"
                >
                  Close
                </v-btn>
                <v-btn
                  color="primary"
                  text
                  @click="uploadProfileImage"
                >
                  Upload
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import Barcodescanner from '../components/BarcodeScanner.vue'

  export default {
    name: 'SetupProductsView',
    components: {
      'barcode-scanner': Barcodescanner,
    },
    data: () => ({
      dialog: false,
      dialogDelete: false,
      dialogUpload: false,
      headers: [
        { text: ' ', value: 'productImage' },
        { text: 'ID', value: 'id' },
        { text: 'Nama Produk', value: 'productName' },
        { text: 'Vendor', value: 'productVendor' },
        { text: 'Barcode', value: 'productCode' },
        { text: 'Harga', value: 'price' },
        { text: 'Deskripsi', value: 'productDescription' },
        { text: 'Quantity in Stock', value: 'quantityInStock' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      localDs: [],
      editedIndex: -1,
      editedItem: {
        productImage: '',
        productVendor: '',
        productCode: '',
        productDescription: '',
        price: 0,
        quantityInStock: 0,
      },
      defaultItem: {
        productImage: '',
        productName: '',
        productVendor: '',
        productCode: '',
        productDescription: '',
        price: 0,
        quantityInStock: 0,
      },
      search: '',
      textBarcode: '',
      sheet: false,
      rulesAvatar: [
        value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
      ],
      fileUploadImage: undefined,
      loading: false,
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
      urlImage () {
        return process.env.VUE_APP_API_URL
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        var self = this
        axios
          .get(process.env.VUE_APP_API_URL + 'products')
          .then((response) => {
            self.localDs = response.data
          })
          .catch((error) => console.log(error))
      },

      editItem (item) {
        this.editedIndex = this.localDs.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.localDs.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      uploadImageItem (item) {
        this.editedIndex = this.localDs.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogUpload = true
      },
      deleteItemConfirm () {
        var self = this
        if (self.editedItem.id) {
          axios
            .delete(process.env.VUE_APP_API_URL + 'products/id/' + self.editedItem.id)
            .then((response) => {
              console.log(response.data.message)
              self.$toast.info(response.data.message, {
                type: 'info',
                position: 'top-right',
                duration: 3000,
                dismissible: true,
              })
              self.initialize()
            })
            .catch((error) => console.log(error))
        }

        this.localDs.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      save () {
        var self = this
        self.editedItem.price = parseInt(self.editedItem.price)
        self.editedItem.quantityInStock = parseInt(self.editedItem.quantityInStock)
        console.log(self.editedItem)

        if (this.editedIndex > -1) {
          var updateObj =
            {
              productName: self.editedItem.productName,
              productVendor: self.editedItem.productVendor,
              productCode: self.editedItem.productCode,
              productDescription: self.editedItem.productDescription,
              price: self.editedItem.price,
              quantityInStock: self.editedItem.quantityInStock,
            }

          axios
            .put(process.env.VUE_APP_API_URL + 'products/id/' + self.editedItem.id, updateObj)
            .then((response) => {
              console.log(response.data)
              self.$toast.info('Produk berhasil terupdate!', {
                type: 'info',
                position: 'top-right',
                duration: 3000,
                dismissible: true,
              })
              self.initialize()
            })
            .catch((error) => console.log(error))
        } else {
          axios
            .post(process.env.VUE_APP_API_URL + 'products', self.editedItem)
            .then((response) => {
              console.log(response.data)
              self.$toast.success('Produk baru berhasil disimpan!', {
                type: 'success',
                position: 'top-right',
                duration: 3000,
                dismissible: true,
              })
              self.initialize()
            })
            .catch((error) => console.log(error))
        }
        self.close()
      },
      searchByFilter (value, search, item) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLocaleLowerCase().indexOf(search) !== -1
      },
      onScanSuccess (result) {
        console.log(result)
        this.sheet = false
        this.editedItem.productCode = result
      },
      uploadProfileImage () {
        var self = this
        self.loading = true
        var formData = new FormData()
        formData.append('productImage', this.fileUploadImage)
        formData.append('id', this.editedItem.id)
        formData.append('prevProductImage', this.editedItem.productImage)
        axios.post(process.env.VUE_APP_API_URL + 'products/uploads', formData)
          .then((response) => {
            console.log(response.data)
            self.$toast.success('Sukses upload gambar produk', {
              type: 'success',
              position: 'top-right',
              duration: 3000,
              dismissible: true,
            })
            self.initialize()
            self.dialogUpload = false
            self.loading = false
          })
          .catch((error) => {
            console.log(error)
            self.loading = false
            self.$toast.error('Gagal upload image', {
              type: 'error',
              position: 'top-right',
              duration: 3000,
              dismissible: true,
            })
          })
      },
    },
  }
</script>
