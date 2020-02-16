import { Route } from "../../ApiTypes";
import { Express } from "express";
import { CreateUserChannelAction } from "../../../Bot/Action/CreateUserChannel/CreateUserChannelAction";
import { Bot } from "../../../Bot/Bot";

export class CreateUserChannel implements Route {
    constructor(private readonly app: Express, private readonly bot: Bot)
    {

    }

    register(): void {
        this.app.post('/bot/server/createUserChannel', async (req, res) => {
            const createUserChannel = new CreateUserChannelAction(this.bot, req.body);
        
            createUserChannel.execute()
                .then(result => {
                    result.applyOnRight(data => res.send(data));

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