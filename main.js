
var Schema = require('graph.ql')

var characters = {
	1: {
		id: 1,
		name: 'Matt'
	},
	2: {
		id: 2,
		name: 'Nicole'
	},
	3: {
		id: 3,
		name: 'Tammy'
	}
}

var schema = Schema (`
	scalar Date

	type Character{
		id: Int
		name: String!
		homeworld: Planet
		films: [Film]
	}

	type Film{
		title: String!
		producers(): [String]
		characters(limit: Int): [Character]
		release_date: Date 
	}

	type Planet{
		name: String!
		population: Int
	}

	type Query{
		find_film (id: Int): Film
		find_character (id: Int): Character
	}

	`, {
		Date: {
			serialize: function(v){
				// console.log('serializing', v)
				return new Date(v)
			}
			},
		Character: {

			},
		Film: {
			producers(film, args){
				// console.log('film',film)
				return film.producers.split(',') //split producers with comma (,)
			},
			characters(film,args){
				// console.log(args)
				var ids = args.limit
				? film.character_ids.slice(0, args.limit)
				: film.character_ids

				return ids.map(function(id){
					
					return characters[id]
				})
			}
			},
		Planet:{

			},
		Query:{
			find_film (query, args){
				// console.log(query,args)
				return{
					title: 'A New Hope',
					producers: 'Bryan, Pipz, Randolf',
					release_date: '01-16-1994',
					character_ids: [1,3,2]
					
				}
				// return Film.find({ id: args.id })

				},
			find_character (query, args){
				console.log (query, args)
			}
			}

		})
//schema will going to output
schema(`
	query find($film: Int){find_film (id: $film){title producers release_date characters (limit:2){ id name }}}`,{film:1}).then (function(res){
			//print without array
			// console.log(res)

			// print with arrays and color
			console.dir(res,{depth:Infinity, colors:true})
			})


// schema(<query>,<variables>)
// 	.then(function (res){
// 		console.log(res)
// 	})
