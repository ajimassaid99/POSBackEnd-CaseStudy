const { AbilityBuilder, Ability } = require("@casl/ability");

function getToken(req){
    let token= req.headers.authorization? req.headers.authorization.replace('Bearer ',''):null;
    return token && token.length? token:null;
}

const policies = {
    guest(user,{can}){
        can('read','Product')
    },
    user(user,{can}){
        can('view','order');
        can('create','order');
        can('read','order',{user_id:user._id});
        can('update','User',{user_id:user._id});
        can('view','Cart',{user_id:user._id});
        can('update','Cart',{user_id:user._id});
        can('view','DeliveryAddress');
        can('create','DeliveryAddress');
        can('update','DeliveryAddress',{user_id:user._id});
        can('delete','DeliveryAddress',{user_id:user._id});
        can('read','Invoice',{user_id:user._id});
        can('update','Rating');
        can('delete','Rating');
        can('create','Rating');
        console.log("2"+ typeof user._id + user._id); 
    },
    admin(user,{can}){
        can('manage','all');
    }
}

const policyFor = user =>{
    let builder = new AbilityBuilder();
    if(user && typeof policies[user.role]==='function'){
        policies[user.role](user,builder);
    }else{
        policies['guest'](user,builder);
    }
    return new Ability(builder.rules);
}


module.exports={
    getToken,
    policyFor
}