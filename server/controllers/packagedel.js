newPackage: (req, res) => {
    console.log("Creating new package");
    var myUser;

    //this should also come from d front end
    //I shuldn't have to find d user cos dey r logged in already
    //but i go fix all dos one once my req, res don dey work
    User.findOne({_id: '5f7e7fb48d9a4b562866a73b'})
        .then(thisUser => {
            console.log(thisUser);
            myUser = thisUser;
        })
        .catch(err => res.json(err));
    //ends here

    const package = new Package({

    //this should be req body
        shipper_name: "Adeola One",
        shipper_phone: "9182000010",
        receiver_name: "Moyo Receiving",
        receiver_phone: "2348025647891",
        // package_weight: 15,
        amount: 35.50,
        del_date: 2020-08-20,
        tracking_code: 'AWfvdiud5',
        origin_loc: myUser.location,
        destination: myUser.location,
        status: "Received",
    //ends here
    });
    package.save()
        .then(newPackage => {
            console.log(newPackage);
            //Updating package info
            const stat = new Tracker({
                action: 'Received',
                user: myUser
            });
            stat.save()
            .then(itemsStat => {
                console.log(itemsStat);
                //we have our stat
                //Updating package count and stat
                let num = 0;
                for(each_item in itemsFromHTML) {
                    num += 1;
                    thisItem = new Item(each_item);
                    thisItem.num = num;
                    thisItem.status = itemsStat;
                    thisItem.save()
                        .then(oneItem => {
                            newPackage.item_count.push(oneItem);
                        })
                }
            });
        })
        .catch(err => res.json(err));
}