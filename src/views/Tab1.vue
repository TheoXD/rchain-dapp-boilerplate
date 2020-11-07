<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>pizzaShop</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1</ion-title>
        </ion-toolbar>
      </ion-header>
    
        <ion-card v-for="pizza in state.menu" :key="pizza">
            <img :src="pizza.picture">
            <ion-card-header>
                <h2>{{pizza.name}}</h2>
            </ion-card-header>

            <ion-card-content>
                <div>
                    {{pizza.ingredients}}
                </div>
                <ion-button color="success" @click="placeOrder(pizza.name)">Place Order</ion-button>
            </ion-card-content>
        </ion-card>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';

import * as rchainToolkit from 'rchain-toolkit';

import { reactive } from 'vue';

import * as pizzaOrderingCode from "raw-loader!@/rholang/orderPizza.rho";

import { PizzaType } from '@/types';

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
                ingredients: "...",
                picture: "/assets/papperoni.jpg"
            },
            {
                name: "Small Sausage",
                ingredients: "...",
                picture: "/assets/sausage.jpg"
            }] as Array<PizzaType>
      });

      const placeOrder = async (name) => {
        const latestBlock = JSON.parse(await rchainToolkit.http.blocks(`https://node0.testnet.rchain-dev.tk`, {
            position: 1,
        }));
        state.latestBlockNumber = latestBlock[0].blockNumber;
        
        console.info(pizzaOrderingCode.default.replace("<<ORDER>>", name.toLowerCase()).replace("<<URI>>", "rho:id:t6owcw7yuz57cn6zwt7cwjeqdczeyyzhwprajdbz1rppa3obuuwwn8"));

          const deployOptions = rchainToolkit.utils.getDeployOptions(
            "secp256k1",
            new Date().valueOf(),
            pizzaOrderingCode.default.replace("<<ORDER>>", name.toLowerCase()).replace("<<URI>>", "rho:id:t6owcw7yuz57cn6zwt7cwjeqdczeyyzhwprajdbz1rppa3obuuwwn8"),
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
