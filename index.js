const fs = require('fs');
const csvToObj = require('csv-to-js-parser').csvToObj;



function extractFromCSV(){
    const data = fs.readFileSync('hierarchy_case_20May2020.csv').toString();
// console.log(data)
const description =
    {
       
        EMPLOYEE_ID: {type: 'string', group: 1},
        DESIGNATION: {type: 'string'},
        DEPARTMENT: {type: 'string'},
        NAME: {type: 'string'},
        MANAGER_EMPLOYEE_ID: {type: 'string', group: 0}
    };

    let obj = csvToObj(data, description);
    // console.log(obj)

    return obj
}

let outputString = ''
let arrayContainingNodes = []

const obj = extractFromCSV()
// console.log(obj)//array of objects


function tabularTohierarchical() {

    //filtering
    function findingRoot(item){
        if(item.MANAGER_EMPLOYEE_ID[0] === null){
            return item
        }
    }
    
    
    const root = obj.filter(findingRoot)[0]
    
    
    root.DESIGNATION = root.DESIGNATION[0]
    
    root.DEPARTMENT = root.DEPARTMENT[0]
    root.NAME = root.NAME[0]
    root.MANAGER_EMPLOYEE_ID = root.MANAGER_EMPLOYEE_ID[0]
    // console.log(obj)
    
    //new property added as reportee
    root.reportees = []
    //array containing nodes
    arrayContainingNodes.push(root)
    // console.log(arrayContainingNodes)

    
    outputString = JSON.stringify(root)
    
     function addingLeftNodes(){
        

        function filterChildren(item){
            if(item.MANAGER_EMPLOYEE_ID !== null && typeof(item.MANAGER_EMPLOYEE_ID) !== "string"){
                if(arrayContainingNodes[0].EMPLOYEE_ID === item.MANAGER_EMPLOYEE_ID[0]){
                    // console.log(item.MANAGER_EMPLOYEE_ID)
                    return item
                }
            }
            else{
                if(arrayContainingNodes[0].EMPLOYEE_ID === item.MANAGER_EMPLOYEE_ID){
                    return item
                }
            }
        
        }
        
        while(arrayContainingNodes.length !==0){
            
            let newChildren = obj.filter(filterChildren)
            // console.log(newChildren)
            for(let i = 0;i< newChildren.length;i++){
                newChildren[i].DESIGNATION = newChildren[i].DESIGNATION[0]
    
                newChildren[i].DEPARTMENT = newChildren[i].DEPARTMENT[0]
                newChildren[i].NAME = newChildren[i].NAME[0]
                newChildren[i].MANAGER_EMPLOYEE_ID = newChildren[i].MANAGER_EMPLOYEE_ID[0]
                // console.log(obj)
                
                //new property added as reportee
                newChildren[i].reportees = []
            }
            // console.log(newChildren)
            arrayContainingNodes =  arrayContainingNodes.concat(newChildren)
            // console.log(arrayContainingNodes)
            // console.log(arrayContainingNodes[0])
            if(outputString === ''){
                outputString = JSON.stringify(arrayContainingNodes[0])
                
            }else if(newChildren.length > 0){
                //
                const manager_id = newChildren[0].MANAGER_EMPLOYEE_ID
                // console.log(manager_id)
                const position1 = outputString.search(manager_id)
                let piece1 = outputString.slice(0,position1)
                // console.log(piece1)
                
                let piece2 = outputString.slice(position1)
                
                let duplicateOfPiece2 = piece2
                let position2 = duplicateOfPiece2.search("reportees")
                piece2 = duplicateOfPiece2.slice(0, position2)
                let piece3 = duplicateOfPiece2.slice(position2)
                
                let finalPiece3 = piece3.replace('[]','')
                // console.log(finalPiece3)
                let piece4 = piece3

                outputString = piece1 +piece2 + 
                finalPiece3.slice(0, 11 ) + 
                JSON.stringify(newChildren) + finalPiece3.slice(11)

                // console.log(outputString)

                
                arrayContainingNodes.concat(newChildren)
                
            }
            arrayContainingNodes.shift()
            // console.log(arrayContainingNodes)
            // console.log(outputString)
            


            
        }
       
    }

    addingLeftNodes()

    return outputString
}


const output = tabularTohierarchical()
console.log(output)
    const outputJSON = JSON.parse(output)

    
    fs.writeFile('./output.json', JSON.stringify(outputJSON, null, 2), err =>{
        if(err){
            console.log(err)
        }else{
            console.log("successfuly updated")
        }
    } )





//    item = [1,2,3,4]
//    console.log(item)
//    item.push(5)
//    console.log(item)
// //    item.push_front(0)
// //    console.log(item)
// item.pop()
// console.log(item)
// item.unshift(0)
// console.log(item)

