import { LightningElement, track, wire } from 'lwc';
import allAccountWithContact from '@salesforce/apex/accountWithContact.allAccountWithContact';
// import contactDetails from '@salesforce/apex/accountWithContact.contactDetails';
import { refreshApex } from '@salesforce/apex';
export default class DisplayAccountWithContact extends LightningElement {

    @track accountList;
    @track contactData;
    rowLimit=5;
    offset=0;
    searchval=''
    
     connectedCallback(){
       this.loadData();
    }
    // helper method to load data
   async loadData(){
        try {
            this.accountList = await allAccountWithContact({limitSize:this.rowLimit,offset:this.offset,name:this.searchval});
            this.accountList = this.accountList.map(ele=>({
                Id:ele.Id, Name:ele.Name, Type: ele.Type, Phone: ele.Phone, Rating: ele.Rating,
                Contacts: ele.Contacts ==undefined? false:ele.Contacts.map(conEle=>({
                    Id:conEle.Id , Name:conEle.Name, Title:conEle.Title, Email:conEle.Email, Phone:conEle.Phone,show:false
                }))
            }))
            console.log('accntList',this.accountList);
        } catch (error) {
            console.log('error',error);
        }
    }
    // display contact when clicking accordion
    toggleSection(event){
        let clasName = event.currentTarget.parentElement.classList;
        let iconClass = event.currentTarget.classList;
        console.log('test', iconClass);
        if(!clasName.contains('slds-is-open')){
            clasName.add('slds-is-open');
            iconClass.remove('slds-button__icon_left');
            console.log('clsName2', clasName);
        }else{
            clasName.remove('slds-is-open');
            console.log('clsName1', clasName);
        }
       
    }
    show
    // openpopover
     displayPopOver(event){
        let newArray = [...this.accountList];
        let toUpdate ={...newArray[event.currentTarget.dataset.index].Contacts[event.currentTarget.dataset.id],show:true}
        newArray[event.currentTarget.dataset.index].Contacts[event.currentTarget.dataset.id] = toUpdate;
        this.accountList = newArray;
    }
// close the popover
    closePopOver(event){
        let newArray = [...this.accountList];
        let toUpdate ={...newArray[event.currentTarget.dataset.index].Contacts[event.currentTarget.dataset.id],show:false}
        newArray[event.currentTarget.dataset.index].Contacts[event.currentTarget.dataset.id] = toUpdate;
        this.accountList = newArray;
    }
    // search account and contact based on name
     handleChange(event){
         this.searchval = event.target.value;
        this.loadData();
            console.log('ac',this.accountList);
       
    }
    // refresh data when contact is saved
     handleRefresh(event){
         this.searchval = '';
        this.loadData();
        console.log('post',this.accountList);
    }

    // lazy loading
    handleScroll(event){
        var top = this.template.querySelector('.slds-scrollable').scrollTop
        var offSetHeight = this.template.querySelector('.slds-scrollable').offsetHeight
        var scrollHeight = this.template.querySelector('.slds-scrollable').scrollHeight
        console.log('height',top+offSetHeight);
       if(top + offSetHeight >= scrollHeight-10 && this.accountList.length>=5){
           this.offset = this.rowLimit + this.offset;
           this.loadData();
           this.template.querySelector('.slds-scrollable').scrollTo(scrollHeight,0)
           console.log('accc',this.accountList);
       }
    }
}