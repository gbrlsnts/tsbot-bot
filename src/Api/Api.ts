import express from "express";
import * as bodyParser from "body-parser";
import { CreateUserChannelAction } from "../Bot/Action/CreateUserChannel/CreateUserChannelAction";
import { Bot } from "../Bot/Bot";

export class Api
{
    private readonly app: express.Express;

    constructor(private bot: Bot)
    {
        this.app = express();
        
    }

    boot()
    {
        this.app.use(bodyParser.json());

        this.registerRoutes();
        
        this.app.listen(3000, () => console.log('Api waiting for requests...'));
    }

    private registerRoutes()
    {
        this.app.get('/', (req, res) => {
            res.send('awesome-teamspeak bot');
        });
        
        this.app.post('/bot/server/createUserChannel', async (req, res) => {
            const createUserChannel = new CreateUserChannelAction(this.bot, req.body);
            console.log('Create user channel', req.body);
        
            createUserChannel.execute()
                .then(result => {
                    result.applyOnRight(res.send);

                    // handling expected error
                    if(result.isLeft()) {
                        res.status(422).send(result.value);
                    }
                })
                .catch(e => {
                    console.log('Sending error response...', e.message);
                    res.status(500).send(e.message);
                });
                
        });
    }
}