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
    
        <ion-button @click="getLatestBlock">GetLatestBlock</ion-button>

      <ExploreContainer name="Tab 1 page" />
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';

import * as rchainToolkit from 'rchain-toolkit';

export default {
  name: 'Tab1',
  components: { ExploreContainer, IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
  setup() {
      const getLatestBlock = async () => {
        const latestBlock = JSON.parse(await rchainToolkit.http.blocks(`https://node0.testnet.rchain-dev.tk`, {
            position: 1,
        }));
        console.info(latestBlock);
      }

      return {getLatestBlock}
  }
}
</script>
