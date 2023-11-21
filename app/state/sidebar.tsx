import { create } from "zustand";

enum SideBarTabs {
  Dashborad,
  Services,
  Files,
  EditProfile,
  Search,
  DealingHand,

  //pda
  ZoneInfo,
  Rti,
  Petroleum,
  OldCopy,
  landSection,
  Unauthorisd,
  Cp,
  Oc,
  Plinth,
  //crsr
  BirthCert,
  BirthTeor,
  DeathCert,
  DeathTeor,
  MarriageCert,
  MarriageTeor,
  NewMarriage,

  //PWD
  WaterReconnect,
  SizeChange,
  TempConnect,
  TempDisconnect,
  NewWaterConnect,
  PermanentDisconnect,

  //DMC
  NewBirthRegister,
  NewDeathRegister,

  //EST
  Marriage,
  Religious,
  RoadShow,
}

interface SideBarState {
  isOpen: boolean;
  change: (value: boolean) => void;
  currentIndex: SideBarTabs;
  changeTab: (value: SideBarTabs) => void;
}

const sideBarStore = create<SideBarState>()((set) => ({
  isOpen: false,
  change: (value) => set((state) => ({ isOpen: value })),
  currentIndex: SideBarTabs.Dashborad,
  changeTab: (value) => set((state) => ({ currentIndex: value })),
}));

export default sideBarStore;

export { SideBarTabs };
