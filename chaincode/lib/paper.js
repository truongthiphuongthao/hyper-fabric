/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const { Contract } = require('fabric-contract-api');
/*const assert = require('assert')*/
class Paper extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const papers = [
            {
                name: 'DHCT',
                owner: 'Thao',
            },
            {
                name: 'DHCT',
                owner: 'Huy',
            },
            {
                name: 'DHCT',
                owner: 'Dang',
            },
            {
                name: 'DHCT',
                owner: 'Hieu',
            },
            {
                name: 'DHCT',
                owner: 'Khang',
            },
            {
                name: 'DHCT',
                owner: 'Tai',
            },
            {
                name: 'CDYT',
                owner: 'Khai',
            },
            {
                name: 'CDCT',
                owner: 'My',
            },
            {
                name: 'DHCT',
                owner: 'Cham',
            },
            {
                name: 'DHCT',
                owner: 'Phuc',
            },
        ];

        for (let i = 0; i < papers.length; i++) {
            papers[i].docType = 'paper';
            await ctx.stub.putState('PAPER' + i, Buffer.from(JSON.stringify(papers[i])));
            console.info('Added <--> ', papers[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryPaper(ctx, paperNumber) {
        const paperAsBytes = await ctx.stub.getState(paperNumber); 
        if (!paperAsBytes || paperAsBytes.length === 0) {
            throw new Error(`${paperNumber} does not exist`);
        }
        console.log(paperAsBytes.toString());
        return paperAsBytes.toString();
    }

    async createPaper(ctx, paperNumber, name, owner) {
        console.info('============= START : Create Paper ===========');
        const paper = {
            name,
            owner,
            docType: 'paper',
        };

         await ctx.stub.putState(paperNumber, Buffer.from(JSON.stringify(paper)));
        const createPaper = await ctx.stub.getState(paperNumber)
        console.log(createPaper.toString())
        console.info('============= END : Create Paper ===========');
    }
    async queryAllPapers(ctx) {
        const startKey = 'PAPER0';
        const endKey = 'PAPER999';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }
    async changePaperOwner(ctx, paperNumber, newOwner) {
        console.info('============= START : changePaperOwner ===========');

        const paperAsBytes = await ctx.stub.getState(paperNumber); // get the car from chaincode state
        if (!paperAsBytes || paperAsBytes.length === 0) {
            throw new Error(`${paperNumber} does not exist`);
        }
        const paper = JSON.parse(paperAsBytes.toString());
        console.log(paper)
        paper.owner = newOwner;
        await ctx.stub.putState(paperNumber, Buffer.from(JSON.stringify(paper)));
        console.info('============= END : changePaperOwner ===========');
    }
   async deletePaper(ctx, paperNumber) {
      console.info('============= START : Delete Paper ==========='); 
      let marbleNumber = await ctx.stub.getState(paperNumber)
      await ctx.stub.deleteState(paperNumber)
      console.log(marbleNumber.toString())
      console.log("Delete succesfully")
      console.info('============= END : Delete Paper ===========');
   }
}
  
/*const { ChaincodeMockStub, Transform } = require("@theledger/fabric-mock-stub")
if(require.main==module){
let chaincode = new Paper()
describe ('Test Mychaincode', () => {
    it("Should init without issues", async () => {
       const mockStub = new ChaincodeMockStub("MyMockStub", chaincode)
       mockStub.mockTransactionStart()
       const initResult = await chaincode.initLedger({stub:mockStub},[])
       const paperResult = await chaincode.queryPaper({stub:mockStub},['PAPER1'])
	let expected = {
                name: 'DHCT',
                owner: 'Huy',
                docType: 'paper',
		
            };
       assert.deepEqual(paperResult, JSON.stringify(expected))	
      const paperChangeOwner = await chaincode.changeCarOwner({stub:mockStub},['PAPER3'], 'Tram')
      const paperChangeResult = await chaincode.queryPaper({stub:mockStub},['PAPER3'])
       let expectedChangeOwner = {
                name: 'DHCT',
                owner: 'Tram',
                docType: 'paper',
		
            };
       assert.deepEqual(paperChangeResult, JSON.stringify(expectedChangeOwner))	
     const paperCreatePaper = await chaincode.createPaper({stub:mockStub},['PAPER10'],'CDKT','Hien')
     const paperCreateResult = await chaincode.queryPaper({stub:mockStub},['PAPER10'])
      let expectedQueryCreate = {
                name: 'CDKT',
                owner: 'Hien',
                docType: 'paper',	
            };
       assert.deepEqual(paperCreateResult, JSON.stringify(expectedQueryCreate))
      /* const paperDelete = await chaincode.deletePaper({stub:mockStub}, ['PAPER2'])
       const paperDeleteResult = await chaincode.queryPaper({stub:mockStub},['PAPER2'])
       let expectedDelete = {
                name: 'DHCT',
                owner: 'Dang',
                docType: 'paper',
		
            };
       assert.deepEqual(paperDeleteResult, JSON.stringify(expectedDelete))
       const paperCreatePaperSame = await chaincode.createPaper({stub:mockStub},['PAPER2'],'DHCT','Dang')
       const paperCreateResult = await chaincode.queryPaper({stub:mockStub},['PAPER2'])
      let expectedQueryCreate = {
                name: 'DHCT',
                owner: 'Dang',
                docType: 'paper',	
            };
       assert.deepEqual(paperCreateResult, JSON.stringify(expectedQueryCreate))*/
     /*});
});
}*/
module.exports = Paper;
