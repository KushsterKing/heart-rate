import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', (req, res) => {
    let data = req.body?.['clinical_data']?.['HEART_RATE']?.data

    let resultArray = []

    if(data?.length > 0){
        let obj = {}
        data.forEach((elm) => {

            let to = new Date(obj['to_date']),
                from = new Date(obj['from_date']),
                on = new Date(elm['on_date'])

            if(!obj['from_date'] || on > to){

                if(obj['from_date']){
                    resultArray.push(obj)
                    obj = {};
                }

                on.setSeconds(0,0);
                obj['from_date'] = on.toISOString()

                let to = new Date(on.getTime() + 15 * 60000);
                obj['to_date'] = to.toISOString()

                obj['measurement'] = { high: elm['measurement'], low: elm['measurement'] }
            } else if( from < on && on < to ) {
                if(Number(obj['measurement']['low']) > Number(elm['measurement']))
                    obj['measurement']['low'] = elm['measurement'];
                else if(Number(obj['measurement']['high']) < Number(elm['measurement']))
                    obj['measurement']['high'] = elm['measurement'];
            }

        })
    }

    res.json(resultArray)
})

app.listen(port, () => {
    console.log('Listening on port ' + port);
})