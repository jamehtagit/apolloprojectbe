const express = require('express')
//const graphql = require('graphql')
const cors = require('cors')
const graphQLHTTP = require('express-graphql').graphqlHTTP;

const app = express()

app.use(cors()) // cross origin requests//

const {GraphQLSchema,GraphQLObjectType,GraphQLString,GraphQLID,GraphQLList} = require('graphql')
//json connecting with kind of json from backend//
const Books = [{id:1,title:'Harry Potter 1', edition:"one",authorid:1},
{id:2,title:'Harry Potter 2', edition:"two",authorid:2},
{id:3,title:'Harry Potter 3', edition:"one",authorid:1},
{id:4,title:'Harry Potter 4', edition:"three",authorid:3},
{id:5,title:'Harry Potter 5', edition:"two",authorid:1},
{id:6,title:'Harry Potter 6', edition:"one",authorid:1},
{id:7,title:'Harry Potter 7', edition:"three",authorid:1},
{id:8,title:'Harry Potter 8', edition:"one",authorid:1},
{id:9,title:'Harry Potter 9', edition:"two",authorid:1},
]

const Authors =[{
    id:1,name:'James',age:40
},
{
    id:2,name:'Joe',age:52
},
{
    id:3,name:'Frank',age:74
}
]

const AuthorType = new GraphQLObjectType({
    name:"Author1",
    fields: () => ({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        age:{type:GraphQLString}
})
})




const BookType = new GraphQLObjectType({
    name:'Book1',
    fields:() =>({
        id:{type:GraphQLID},
        title:{type:GraphQLString},
        edition:{type:GraphQLString},
        author:{type:AuthorType,
                resolve:(book)=>{

                    return Authors.find((author) => book.authorid === author.id)
                }}
    })
})

const RootQuery = new GraphQLObjectType(
    {
            name:'BookQuery',
            fields:() =>({
                book:{
                    type: new GraphQLList(BookType),
                    resolve:(parent,args)=> {return Books}
                }
            })

}
/*{
    name:'AuthorQuery',
    fields:() =>({
        author:{
            type: new GraphQLList(AuthorType),
            resolve:(parent,args)=> {return Authors}
        }
    })

}*/

)

/*const schema = new GraphQLSchema(
    {
        query:new GraphQLObjectType({
            name:'Greetingstoall',
            description:'this is to greet all learners',
            fields:() => ({
                    message:{type:GraphQLString,
                    resolve:() =>{return 'Hello Learners'}
                    }

            })

        })

    }
)*/

const MutationQuery = new GraphQLObjectType({
            name:'AddBooks',
            description:'This is to add books',
            fields:() =>({

                addBook:{
                type:BookType,
                args:
                {
                    title:{type:GraphQLString},
                    edition:{type:GraphQLString }
            
            },
            resolve:(parent,args) =>{
                let book = {id:Books.length +1,title:args.title,edition:args.edition}
                Books.push(book)
                return book
            }
        }

            })

})
const schema = new GraphQLSchema({
    query:RootQuery,
    mutation:MutationQuery
})

app.use("/graphQL",graphQLHTTP(
{
    graphiql:true,
    schema:schema
}

))


app.listen(8000,()=>{
    console.log("Running API")
})


