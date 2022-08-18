<template>
  <v-container>
    <v-form>
      <v-text-field 
      
        placeholder="Enter keyword"
        v-model="search">
        
      </v-text-field>
    </v-form>
    <v-btn
  color="primary"
  elevation="2"
  large
  @click="click()"
>Search</v-btn>

<h1 v-if= !responses.length> Following keyword/s doesn't exist in any file.</h1>
<div v-if = responses.length> 
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">
            File Name
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="response in responses"
          :key="response.fileId"
        >
          <td><a v-bind:href=response.fileLink>{{ response.fileName }}</a></td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
   </div>  
  </v-container>
</template>

<script>
 import axios from "axios";
export default {
  name: 'Search',
  data(){
    return {
      search:"",
      fileName:"",
      fileLink:"",
      responses:[""]

    }
  },
  methods:{
    click(){
    axios.get("http://localhost:7000/search/:" + this.search).then(
      (res)=>{
        this.fileName = res.data.fileName
        this.responses = res.data
      }
    )
    }
  }
}
</script>
