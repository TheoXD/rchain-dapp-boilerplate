<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 1</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1</ion-title>
        </ion-toolbar>
      </ion-header>
    
        <ion-card v-for="pizza in state.menu" :key="pizza">
            <img src="/assets/papperoni.jpg">
            <ion-card-header>
                <h2>{{pizza.name}}</h2>
            </ion-card-header>

            <ion-card-content>
                {{pizza.ingredients}}
                <ion-button @click="placeOrder(pizza.name)">Place Order</ion-button>
            </ion-card-content>
        </ion-card>

    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';

import * as rchainToolkit from 'rchain-toolkit';

import {reactive} from 'vue';

export default {
  name: 'Tab1',
  props: {

  },
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
  setup() {
      const state = reactive({
            latestBlockNumber: "Get latest block",
            menu: [{
                name: "Papperoni",
                ingredients: "..."
            },
            {
                name: "Small Sausage",
                ingredients: "..."
            }]
      });

      const placeOrder = async (name) => {
        const latestBlock = JSON.parse(await rchainToolkit.http.blocks(`https://node0.testnet.rchain-dev.tk`, {
            position: 1,
        }));
        state.latestBlockNumber = latestBlock[0].blockNumber;

          const deployOptions = rchainToolkit.utils.getDeployOptions(
            "secp256k1",
            new Date().valueOf(),
            `new return(\`rho:rchain:deployId\`),
            lookup(\`rho:registry:lookup\`)
            in {
            new valueCh, result in {
                lookup!("rho:id:t6owcw7yuz57cn6zwt7cwjeqdczeyyzhwprajdbz1rppa3obuuwwn8" , *valueCh) |
                for (pizzaShop <- valueCh) {
                pizzaShop!("${name.toLowerCase()}", *result)
                | 
                for (@order <- result) {
                    return!(order)
                }
                }
            }
            }`,
            "e9934d79b12317d0f3dad7f915c1cc075a47cbd884fd80d7dfeefacf03fa214e",
            "0420d065ce52c1759e467b9427f494ff665210d226967e68b65eee180a96a3148fe849d1f105a7f130db938b48eb6c28f20dd530365aaeb39af8bfc00117684b18",
            1,
            100000,
            state.latestBlockNumber
        );
        try {
            const response = await rchainToolkit.http.deploy(
                "https://node0.testnet.rchain-dev.tk",
                deployOptions
            );
            console.info(response);
        }
        catch(err) {
            console.err(err);
        }
      }

      return {state, placeOrder}
  }
}
</script>
