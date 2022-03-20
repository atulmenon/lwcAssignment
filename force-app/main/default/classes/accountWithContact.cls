public with sharing class accountWithContact {
    @AuraEnabled
    public static List<Account> allAccountWithContact(Integer limitSize, Integer offset ,String name) {
        List<Account> filterAccount = new List<Account>();
        Set<Id> acntId = new Set<Id>();
        String searchName = '%'+name+'%';
        if(name==''){
            filterAccount = [select Name, Type, Phone, Rating, (Select Name, Title, Email, Phone from Contacts) from Account limit :limitSize OFFSET :offset];
        }else{
             for(Contact cont: [Select AccountId from Contact where name like :searchName or Account.Name like :searchName]){
                acntId.add(cont.AccountId);
             }

            filterAccount = [select Name, Type, Phone, Rating, (Select Name, Title, Email, Phone from Contacts ) from Account where Id In:acntId limit :limitSize OFFSET :offset ];
          
        }
        System.debug(filterAccount);
        return filterAccount;
    }
}
