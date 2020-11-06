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
    
        <ion-button @click="getLatestBlock">{{state.latestBlockNumber}}</ion-button>
        <ion-button @click="deployRholang">Deploy some rholang</ion-button>

      <ExploreContainer name="Tab 1 page" />
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';

import * as rchainToolkit from 'rchain-toolkit';

import {reactive} from 'vue';

export default {
  name: 'Tab1',
  components: { ExploreContainer, IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
  setup() {
      const state = reactive({
            latestBlockNumber: "Get latest block"
      });

      const getLatestBlock = async () => {
        const latestBlock = JSON.parse(await rchainToolkit.http.blocks(`https://node0.testnet.rchain-dev.tk`, {
            position: 1,
        }));
        state.latestBlockNumber = latestBlock[0].blockNumber;
      }

      const deployRholang = async () => {
          const deployOptions = rchainToolkit.utils.getDeployOptions(
            "secp256k1",
            new Date().valueOf(),
            `new hello, stdout(\`rho:io:stdout\`) in {
            hello!("world") |
            stdout!(*hello)
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

      return {state, getLatestBlock, deployRholang}
  }
}
</script>
