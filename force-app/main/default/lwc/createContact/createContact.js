import { api, LightningElement, wire } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import Email from '@salesforce/schema/Contact.Email';
import LastName from '@salesforce/schema/Contact.LastName';
import FirstName from '@salesforce/schema/Contact.FirstName';
import Title from '@salesforce/schema/Contact.Title';
import Phone from '@salesforce/schema/Contact.Phone';
import AccountId from '@salesforce/schema/Contact.AccountId';
import Contact from '@salesforce/schema/Contact';
import ShowToastEvent from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import allAccountWithContact from '@salesforce/apex/accountWithContact.allAccountWithContact';
export default class CreateContact extends LightningElement {
    isModalOpen;
    @api accountId
    @api acntName
    firstName
    lastName
    title
    email
    phone
    refreshTable
    
    closeModal(event){
        this.isModalOpen = false;
    }
    async submitDetails(){
        const fields = {}
        fields[Email.fieldApiName] = this.email
        fields[FirstName.fieldApiName] = this.firstName
        fields[LastName.fieldApiName] = this.lastName
        fields[Title.fieldApiName] = this.title
        fields[AccountId.fieldApiName] = this.accountId
        fields[Phone.fieldApiName] = this.phone
        const recordInput ={apiName: Contact.objectApiName, fields: fields}

        await createRecord(recordInput)
        .then(cont=>{
            console.log('cont',cont);
            this.isModalOpen = false
        }).catch(error=>{
           
        })
        this.dispatchEvent(new CustomEvent('selected'));
        
        
    }
    openModal(){
        this.isModalOpen = true;
    }

    handleChange(event){
        if(event.target.label =='First Name'){
            this.firstName = event.target.value;
        }
        if(event.target.label =='Last Name'){
            this.lastName = event.target.value;
        }
        if(event.target.label =='Title'){
            this.title = event.target.value;
        }
        if(event.target.label =='Email'){
            this.email = event.target.value;
        }
        if(event.target.label =='Phone'){
            this.phone = event.target.value;
        }
    }
}

/** this.dispatchEvent(new ShowToastEvent({
                  title: 'Success!!',
                  message: 'Project Created Successfully!!',
                  variant: 'success'
              }), ); */