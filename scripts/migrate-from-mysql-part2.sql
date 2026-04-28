-- Migration Part 2: remaining users + dashboard relationships
-- Run AFTER migrate-from-mysql.sql
-- psql $DATABASE_URL -f migrate-from-mysql-part2.sql

BEGIN;

-- ============================================================
-- REMAINING USERS (continued)
-- ============================================================
INSERT INTO "User" (id, firstname, lastname, email, password, role, company_id, franchise_id, is_active, created_at, updated_at)
VALUES
  ('851064b3-0dd5-40ce-ace1-1874c171837a','Antoine','Kuhn','antoine.kuhn@tribal.paris','$2a$10$w5hthbFqcJNIaxGY5K9Au.d1E5evME5lXNqSVSfKh8d5HBud.mzQW','admin','79453ad2-06a6-4886-aeb5-0a0e9bcc29ed',NULL,true,NOW(),NOW()),
  ('8e5f5ff6-fbcd-4356-8d17-0994baf3d03b','Alix','FALCONNET','alix.falconnet@groupe-gexxia.fr','$2a$10$XkSo4OidrjVpcddb8AP7EuUK8vWRgYCoHdQrAlp4UGqVNgIKgd/Kq','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('8f398b5d-db42-438e-9498-58a5c02eb1c9','Alicia','SENESTRARO','a.senestraro@dalauto.fr','$2a$10$I.pFsyzwYMY5Pu4gyivHo.PBWlsPzpiojapWeEKKpliFwxYnVvU.W','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('8f66c1b6-e176-4cbb-81c6-07f2e487374d','Agathe','Pronier','a.pronier@samsung.com','$2a$10$UAtZyJ5H45NxfrmwcLde1OIHlmCXagfqm0ChqKSHTRNbO8g6XxxWS','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('8fdf35ba-c4c7-49a8-a16c-6130e2bddb2c','Eva','SAUVAGE','e.sauvage@groupehecquet.com','$2a$10$QYtZOpWMZVlP2f.ENb.Hh.Jpmc3xjRWTEjCF43q/J5CgpLFzOjYXW','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('911fd779-62af-4a32-8afe-be02eeb8de2b','Moeata','Fonteneau','m.fonteneau@partner.samsung.com','$2a$10$i8lFGsrqaqoGW56vzDQw0ekQIKoXF3e0cE96b5V9RsVcoDwpOAkrm','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('914cfc36-f5b6-4895-914f-ce38c6fe409f','Guillaume','Casbonne','guillaume.casbonne@volkswagengroup.fr','$2a$10$XVg2rfHt37tTAghQwQ2uCutnE2f1ATTKeztbHZB5y.PEntNvJuElu','brand_admin','7319b938-85a2-4094-a419-39c50a78cae8',NULL,true,NOW(),NOW()),
  ('95f772e3-8a10-446c-a5c4-e33dbd2668af','David','Nguyen','david.nguyen@audi.fr','$2a$10$Wkwo0XvszCeIKP7HCJ3AyeAGAThkDy2XeZPV8nTwbPT3bKrtbkK6O','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('964c2b07-f444-46d1-8887-48ee06873de6','Jessica','SCHNEIDER','jessica.schneider@geauto.fr','$2a$10$SSNMTKekPxpv7DwoNADddua4aDpJ6bgJPtOJWyocyYi3piB7QO6ee','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('97376a88-6958-49e7-91a5-1371a49ad4a6','Barbara','Assmann','b.assmann@samsung.com','$2a$10$8gKWVvTyTIwcceGVwHjgk.0hJvoT1jDCK.Czdd9ps2vigazpgtr/S','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('9b41adf6-7f57-462c-be9f-1201e8fd6557','Edouard','Frapier','edouard.frapier@ddb.fr','$2a$10$8juzP6IxctRC/HfWFlGbkez4ylUmroyikYL/ZwPTnx2JZgiG2k8wC','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('9c501181-fbfd-4059-8ea7-8e40c17656cc','Célia','Fleurentdidier','celia.fleurentdidier@tribal.paris','$2a$10$7AQiIGx9If0k37pHlpNcnOaXfvLYgGYLFBt24JKE2mNhGpjJUWxIu','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('9cf4a684-8e2a-4b92-b406-3d679d6673eb','Rima','Rajwani','rima.rajwani@audi.fr','$2a$10$oTUBSgFzXd1KTRSebbubi.SlnijOGcEbzWpCUlJVXXBZKk41WgVCq','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('9eb88b53-76c3-4598-ac32-6250e8233b8d','Alexia','LEDUC','alexia.leduc@sipa-automobiles.fr','$2a$10$zmY6/f6vpt2ckyPR3svfV.3VyLU3A6pFLvbqrjf38sVVtMBz288VK','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('9f6598c9-09cc-4e26-889e-5d0f454829c8','Dimitri','Dores','dimitri.dores@linpid.fr','$2a$10$Vkip1tvpkLn/bbdEXzoQeuEbyUSc7qQ6Qw6ux2K6.urOKy96/aO1q','brand_admin','ecb3221b-4bd0-4093-8b13-d50c800da80b',NULL,true,NOW(),NOW()),
  ('9fddf1db-e9b6-43da-996c-630deb62cf32','Elisa','COUSTY','elisa@vw-nimes.com','$2a$10$maogyz21fHdhm8Wg6WwJGuUKsXMwdiy.xyFaP.m.PAWXPNbjZ0.SW','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('a2142588-0c43-4ede-97fa-cebba8d6a734','Lisa','VISSE','lisa.visse@lemauviel.fr','$2a$10$sm4asYp9l3j7MFCcLbztZuaMoGJW3lw420a1vodfgcuoVKF5RSjpy','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('a23e6b3b-f825-46a1-8496-06216e57d18d','Johann','Varin','johann.varin@audi.fr','$2a$10$.pZxCo4253GRr7.ZBegI4.w2V5HA4Pi34jk2EQr/CKY64eKmfZGRK','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('a469dc92-a4d7-4728-8caf-7b4f933d600b','Romain','POISSON','romain.poisson@lecluseautomobiles.fr','$2a$10$BetXfyYtTlVVd78dv1vEG.zPapkBpkuFiz8dMy4Mekw8cqLndKcWi','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('a908ee3a-33f9-48b6-b738-fdb1ddf65195','Pierre-Antoine','Kraimps','pierre-antoine.kraimps@ddb.fr','$2a$10$Zqc9MzPaOqurbtQGFaH/oe/wp8nXpQ6nhejrbDHGSwIKOZVY/zDI2','brand_admin','7319b938-85a2-4094-a419-39c50a78cae8',NULL,true,NOW(),NOW()),
  ('aa17e0a0-636b-48ad-ab93-93dc01200b25','Florence','Catel','f.catel@samsung.com','$2a$10$J37Jut2mmuOOM1.sr1KwKeV7xWXhZuqQCv7YL90x0a/5B1iBV5YkG','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('ab8ad8bc-ea9f-42c2-a1ec-c1ecd16a7eec','Robin','Cirou','robin.cirou@audi.fr','$2a$10$UmyYVF8ImcIOYipqa4yxdeIrlaBv0CEBhy4AkPQdzNILuR7kTbeti','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('ad785634-eb83-4015-a1a8-e87e1282b12e','Laurine','TABIT','laurine.tabit@valauto.fr','$2a$10$jkGEZysU1TR.379YvuKmh.SBYlXDBwENKGwsY58DrVEQ1iyRnyUAW','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('adf1e1f6-f0cb-463d-ad8c-eae647039092','Marine','Garnier','m.garnier@partner.samsung.com','$2a$10$0b//h6CMzlVnGF5wsjT/Puzku.0TcrWwN14Z5udbgfInbu929RDvO','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('ae274105-5129-4cf3-a5b4-93720339d776','User','DDB','user@ddb.fr','$2a$10$pDMw2ctWDbo6ffG6LYceu.7Dgg5AuK7gZF3ARDYU2TyuRuWq5lTI6','brand_admin','79453ad2-06a6-4886-aeb5-0a0e9bcc29ed',NULL,true,NOW(),NOW()),
  ('ae9aabba-3e7e-45e5-8dc3-2863d686e600','Hugo','Bochu','hugo@stride-up.fr','$2a$10$dwtDW7LyeXGiFBbiVqTuhuNNCCJEurNFitQR2OSnKw.lUaH42ntYy','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('b1aba07b-2f4e-4163-a8be-8ed08fecb0be','Juliette','Boulle','juliette.boulle@romance-agency.com','$2a$10$pLHablDb0DyKj6t5DI85me5zAEVpDf70z2r7LAowBuWlI0C6LB/ui','brand_admin','ecb3221b-4bd0-4093-8b13-d50c800da80b',NULL,true,NOW(),NOW()),
  ('b2ce91a8-b56b-48c6-9f78-8f76e9b80079','Sylvain','Bucalo','sylvain.bucalo@audi.fr','$2a$10$S7tQznJDcGNdmLXBQTsePenJIFGZhOUMjoyOm7v1ROgjNomDELFIy','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('b371cb2c-6906-49d6-8e3b-49b588e0796f','Margot','Musche','m.musche@samsung.com','$2a$10$hAt4W2/RigCRehG36FWP0uk4H3WdZgYL1N2sGi.g0YGD9OkrNTCAy','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('b3e16981-bc6b-4c3d-8fca-230ce0adc6e5','Aurélianne','PINEL','apinel@suma-auto.com','$2a$10$dadcQ1paPQBHI5APGHctb.fvSJeuPu1KRWWT9ZqUbW6O6HD7nAYLS','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('b73d3f4e-b1a4-4b3c-8bfa-287c4bdcd977','Florian','Ami Philolaus','florian.ami-philolaus@seat.fr','$2a$10$ZV0AFOPewN6SsA5J6i9ggOCWKk8PMh/CP73b2fEGW2JcD/Kc2lfE.','brand_admin','7319b938-85a2-4094-a419-39c50a78cae8',NULL,true,NOW(),NOW()),
  ('b89e5f7e-abae-4986-9c63-734aa8cc83d5','Julien','Test','julien_3437@hotmail.com','$2a$10$241yB5W/BZ11SDNR3r5VSu9rHPFXky7josQ8P7k9BvNr9wRl/cXyO','brand_admin','7319b938-85a2-4094-a419-39c50a78cae8',NULL,true,NOW(),NOW()),
  ('bd953bca-7577-4205-b1f3-28513edb1463','E','DF','equipe@edf.fr','$2a$10$wUUaoz9FnVSo/77zhCDQwe.NCqvLxtq5PmSpaDTLdYV2bI7eLbSwu','brand_admin','3949e1fd-f574-4271-a642-c9ab54c18737',NULL,true,NOW(),NOW()),
  ('be466540-c1c8-4d5b-89cc-77dd4fc34364','Delphine','Thebaud','d.thebaud@partner.samsung.com','$2a$10$TE1Iq1cKyVRZBGZM96owfeY78CxHYad3fBbm0isE/b/KNLN1hBId.','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('bf0a5dc1-feab-4add-9a43-3866b083f326','Julien','Darchy','julien.darchy@tribal.paris','$2a$10$Ye5NM4OgIHSP.ZXTcv/ijunR5tvBXAiJjCEDCaQL9MAKVPmC/d8he','admin','79453ad2-06a6-4886-aeb5-0a0e9bcc29ed',NULL,true,NOW(),NOW()),
  ('c2b53ad4-9485-446c-a304-2c7b4bcec44a','Christopher','Tranmer','christopher.tranmer@tribal.paris','$2a$10$LYnsqHqwn9eimJoFDiEeoeYfnKsKMDMIOJkWW2rthVIgVGbiYAF3i','admin','79453ad2-06a6-4886-aeb5-0a0e9bcc29ed',NULL,true,NOW(),NOW()),
  ('c3687d84-657b-4c96-b25f-8579ee290b8c','Mayssa','Labadlia','mayssa.labadlia@omc.com','$2a$10$O9KAXfKbivwQ2zQj1gmTMezbR7L82xIA8TXQ5tr4iGmnEmqGLyuA2','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('c6c7b636-f7bd-4a24-9fcf-5d12ba7b0b44','Léa','Le Goff','lea.legoff@omc.com','$2a$10$od1.WiC8/HntfPiMvUEI9e23R18e22QN5YbiYJYVhrUB3Ncmc20F2','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('c98b4e5a-3dea-491f-8be4-30a140266c24','Christophe','Lichtenstein','christophe.lichtenstein@romance-agency.com','$2a$10$b6uocEPrurVZQE.2OCD4vOYFOPIZjCNUEDrwniWrqPzEeBzyDRUVq','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('cb6250f9-9bd4-4142-8574-a8aaeb9b387e','Guillaume','Richard','guillaume.richard@intradef.gouv.fr','$2a$10$VrlSbBTDESFeNT6S0svOOeBtQ1vtKcnoukQ5WgtuWhjiQGf3wbk9u','brand_admin','ecb3221b-4bd0-4093-8b13-d50c800da80b',NULL,true,NOW(),NOW()),
  ('cc68ccf9-5949-4caf-a1df-71b44625f38e','Jean-Baptiste','Esteve','jean-baptiste.esteve@volkswagengroup.fr','$2a$10$dDHGqkGDEvHsDj7uGOFzHOYAqk6Wj9Klb3aMjIVfaTOkd/Y0uMlQ6','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('cca174fe-654f-4746-9e1c-252e76fe3270','Matthieu','KERLEO','matthieu.kerleo@jeanrouyerautomobiles.fr','$2a$10$Ivwj8yaqsAoSr7cTbCx76.uHlCN3mkoNs0iJXhgtsRmR/4pP11Qlq','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('ce5ffb16-6b45-4a6f-8a86-574dfa52b84f','Andrea','Gerbeau','andrea.guerbeau@intradef.gouv.fr','$2a$10$MwSRA4bvfXX1H8bw3OnGquLXPUceomiK7KbpgiYdUywX.PY9JJkxW','brand_admin','ecb3221b-4bd0-4093-8b13-d50c800da80b',NULL,true,NOW(),NOW()),
  ('ce935648-9c6a-4571-b2c8-c2d94236b357','Emeline','GAUTHIER','e.gauthier@hfmaurel.com','$2a$10$5BGN9bAr.ufzjVNOsZ59ROvt73XyLAqye4IUeB3tkbj92.ZOHIVZa','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('d001b60f-fd7c-4a73-8191-3572a5d9df4a','Marjorie','COSTES','m.costes@groupefabre.com','$2a$10$H./fz0RQfLpEs3.gDZf2mOVpnd0re8SojhfZOITdJl9nHczLxJ3Km','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('d1b1cf51-b3b1-49a1-8c5c-0d695765b085','Elise','Remark','elise.remark@audi.fr','$2a$10$E5aWZNOBA5RgzlBHCSozwOyGquaWR.Jx63TIGUmzIVuXQr1W7cisS','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('d4be29c6-3371-4409-8f47-4c72ef6c81e5','Aymeric','BEAL','aymeric.beal@groupe-genin.fr','$2a$10$T4uwp9IDurJL.rkRbCir/.LOJEU7vU135BcKBICVFPGfPDKdi2ZPe','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('d4f564ca-250f-4b8d-88e5-ce98a2b55e93','Camille','MARILLER','camille.mariller@deffeuille.fr','$2a$10$0RXUf2iwNcDLG7.lE7wOOeX.LdiTlHlHd4Bl7T7jOH93AfxIAhRne','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('dbe4d50b-ecbe-47b6-815d-0a3b3b256f75','Claire','PRAT','c.prat@faurie.fr','$2a$10$JD1F1rUV3bSadOIzUdw70uO2cfjGYXW3gbKYaqczW5/Kt45acIGTC','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('deb88ae6-547d-40c6-8d16-51206e947daf','Andrea','Martos','andrea.martos@omc.com','$2a$10$7WmsbCQTujcnN0TNfS9PtOYfOxWwkCXaxrBXcyQ8lUyf8/QeQp0wu','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('df391d51-4942-45b2-b803-44d1caa6dae4','Clément','Braud','clement.braud@audi.fr','$2a$10$RJ5gUwlGsZpIIGAFGmsM7uaarjcNRdzZUUZDO.FXD4vKSKQicoBG6','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('dfbea79c-cb47-4cd4-a723-cf574e5afc01','Deborah','Barbe','deborah.barbe@audi.fr','$2a$10$pJpNPYCMrcemGrnKMNeWYOFD6g0xEA4EVfER0gR/ybxz81F8A.Ctu','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('e0119503-c278-4d16-880d-142c4e58ff40','Laurène','Baroin','laurene.baroin@seat-cupra.fr','$2a$10$fNnl/xRzcOwU7E3vhUwlNO7k4SwGhoI0xk9By4F9p1NjQgL83UO/m','brand_admin','7319b938-85a2-4094-a419-39c50a78cae8',NULL,true,NOW(),NOW()),
  ('e25cab5a-cfe7-47ce-ad81-ade24f6823cd','Jérôme','Méresse','jerome.meresse@seat.fr','$2a$10$nzexcS9YKwmhh.D7Wlm84OukDHoCjUZCA5hEMBDK4slwe.Js1mu/.','brand_admin','7319b938-85a2-4094-a419-39c50a78cae8',NULL,true,NOW(),NOW()),
  ('e2c60d8d-fbbf-4643-9e20-2e462c7bee1e','Cécile','COLLET','c.collet@jeannin-automobiles.com','$2a$10$QbhQtnlXr3BZOQwRF4xXbek6Oi5v2MJNzpiyagY.HKCUGO7tBQaaG','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('eb18a391-5d0a-4527-adc6-d03d3f3fb0c4','Johanna','BURAIS','infoaudi@segondauto.com','$2a$10$noMDGA3/4Sj6SvZpCH8oAe7qWASfAfkyus7k.If83TtNeHPvU5nC2','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('eb947812-3ebb-4d5c-95ea-fb0bf4607950','Equipe','AAE','equipe@aae.fr','$2a$10$4e6aCtWqwHcMLk/TaICE6.v71TN79rJqGd6ok4so4vShOgd4P.cnm','brand_admin','ecb3221b-4bd0-4093-8b13-d50c800da80b',NULL,true,NOW(),NOW()),
  ('ef36b0f0-b30b-43c5-b510-221c1227310b','Timothee','Gazeau','timothee-gilles-herluin.gazeau@seat.es','$2a$10$DmIJm1b7ijteXLVNuhP59u0fDgaP8W55DSwUFraY5oUot3ic71neW','brand_admin','7319b938-85a2-4094-a419-39c50a78cae8',NULL,true,NOW(),NOW()),
  ('eff72b6a-137c-4099-a016-88d05536ec89','Manon','WILFART','m.wilfart@jeannin-automobiles.com','$2a$10$2ONeTuw9p6KieC5wenqUbuSUDGXQOzPyYlyVZkRsdH6GheFezhesK','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('f19d93d2-c282-43a4-b0a3-6e3d863d0665','Sarah','Metivier','sarah.metivier@sipa-automobiles.fr','$2a$10$d9HG/MiPQA44.rPmTXzGAuapSrvyEIaxlC0EXV3DMnRrIL5oQ1sOG','viewer','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('f49ef0f4-f04b-4bc9-b74c-79c39d919c71','Arthur','Calvet','arthur.calvet@omc.com','$2a$10$72VdxqUSvHfVSdxnByCjdueLhXfvZRyOhHxN6y04kafDXsjpWwd4G','brand_admin','7319b938-85a2-4094-a419-39c50a78cae8',NULL,true,NOW(),NOW()),
  ('f80a5e2a-c52f-4a68-b3bc-8e7dd6d86eb0','Bianca','Belloir','bianca.belloir@omc.com','$2a$10$fGu.kKzn99TPEUwzCXJKO.pOMWUSdrKmxV/KDOmHqFpzTFzgux3FC','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('f9b53699-f9a2-4755-9d7e-0cf087a94ccf','Julie','Hasle','julie.hasle@ddb.fr','$2a$10$FkZfh6HDo4Z/8R1Y2a7.gOho0JrigIAYvO87RgeridHMVD0Gmwq2O','brand_admin','7319b938-85a2-4094-a419-39c50a78cae8',NULL,true,NOW(),NOW()),
  ('ff5cd191-5811-4bca-8681-a4fe367d7832','Kamylia','Hari','kamylia.hari@ddb.fr','$2a$10$say4WLJcPwnE5ivgRdEvKe/AZ/xNeEGbzs9iX6PA.WoGpNP/thHwi','brand_admin','7319b938-85a2-4094-a419-39c50a78cae8',NULL,true,NOW(),NOW()),
  ('ffca1849-f0d4-4acb-9c08-713435046581','Amélie','TERNAUX','aternaux@groupedeboussac.fr','$2a$10$Q6kgpiS9e0BiVI6fgjq6auNeJhL5snKpEVf6rFzVoae1qnnYTc66K','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- DASHBOARDS (LookerDashboard → Dashboard)
-- ============================================================
INSERT INTO "Dashboard" (id, name, company_id, looker_url, active, created_at)
VALUES
  ('17552791-7c73-4f88-b309-32cca0bb40bf','Exec Summary (mobile)','3e43e563-f69e-4573-8285-7283915a662f','https://lookerstudio.google.com/embed/reporting/9a8f45aa-83cb-418b-86fa-ef6769a8062b/page/p_uyixiu9ptd',true,NOW()),
  ('193b79b3-a990-486d-8d6c-d061d439f5c6','Audi FR Dashboard 360','3e43e563-f69e-4573-8285-7283915a662f','https://lookerstudio.google.com/embed/reporting/738af869-271e-4fd3-9f88-30b575ad0be8/page/p_3kmspcvpsd',true,NOW()),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','Audi Dashboard 360','3e43e563-f69e-4573-8285-7283915a662f','https://lookerstudio.google.com/embed/reporting/3417596c-605d-4420-9720-a00023459759/page/p_3kmspcvpsd',true,NOW()),
  ('3e6f55ec-0d73-4516-8cc2-6c4e908e0a26','Local performance','0b935110-f7e6-4d60-8e62-e073fe64c079','https://lookerstudio.google.com/embed/reporting/3417596c-605d-4420-9720-a00023459759/page/p_2ugeb2pkkd',true,NOW()),
  ('4554c6f2-7637-4c3a-9aab-d8f7b599f3c0','Social Media Brand','583b6953-b97e-41c3-9dd5-70ffc20cb93d','https://lookerstudio.google.com/embed/reporting/35e955d5-5790-4f1f-a71a-dbc42bc7857e/page/p_f8yh0pbv4c',true,NOW()),
  ('4f1da606-7db5-4fe2-a9fc-a9afd2905080','Dashboard 1','79453ad2-06a6-4886-aeb5-0a0e9bcc29ed','https://lookerstudio.google.com/s/lMgyyccm6es',true,NOW()),
  ('522dfede-f57b-43ff-ad9c-630bc0895f49','Dashboard 2','79453ad2-06a6-4886-aeb5-0a0e9bcc29ed','https://lookerstudio.google.com/embed/reporting/b110eebe-b8b2-4f11-8bff-ee445b8bf727/page/p_f48vzeyp4c',true,NOW()),
  ('588c6bb2-cb80-4184-9909-72455c3c303c','Dashboard 3','79453ad2-06a6-4886-aeb5-0a0e9bcc29ed','https://lookerstudio.google.com/embed/reporting/779b589e-b619-4099-8104-adc6c0f5cebe/page/p_tcvukhnw5c',true,NOW()),
  ('67776bbf-e086-4ec7-b4ea-78ff8b774d07','Audience Gravity Map','0b935110-f7e6-4d60-8e62-e073fe64c079','https://lookerstudio.google.com/embed/reporting/3417596c-605d-4420-9720-a00023459759/page/p_2ugeb2pkkd',true,NOW()),
  ('6edc1ac8-03f4-468c-877d-43531369c9e0','[TEST] SEAT/CUPRA DB360°','79453ad2-06a6-4886-aeb5-0a0e9bcc29ed','https://lookerstudio.google.com/embed/reporting/0834b41c-35fc-45ca-8d9e-07f08e085bb6?pageID=currentURL',true,NOW()),
  ('79f8e18b-172d-455f-a6f4-3489cb53ef3b','DB 360 EDF','3949e1fd-f574-4271-a642-c9ab54c18737','https://lookerstudio.google.com/embed/reporting/18f60080-f541-417d-92fe-e4976128f491/page/p_jl695j3wld',true,NOW()),
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','Social Media Samsung','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229','https://lookerstudio.google.com/embed/reporting/b91c8ad6-94be-4e23-80cd-a5df71078ef2/page/p_f48vzeyp4c',true,NOW()),
  ('bd87cb63-7e77-4e75-89e7-a0d3a102885b','Dashboard 360','ecb3221b-4bd0-4093-8b13-d50c800da80b','https://lookerstudio.google.com/embed/reporting/a759e203-5d2d-4765-8842-4fada82cd249/page/p_6ifo3u6xzd',true,NOW()),
  ('be61491e-357a-4055-9399-9b26c6611dcd','CRM Piloté','583b6953-b97e-41c3-9dd5-70ffc20cb93d','https://lookerstudio.google.com/embed/reporting/5543ed00-cb60-4cb9-9c93-80134e21ba2d/page/p_jp94xz41gd',true,NOW()),
  ('c785c954-edc1-4b4c-bdaf-8c5b87559f69','SEAT/CUPRA DB360','7319b938-85a2-4094-a419-39c50a78cae8','https://lookerstudio.google.com/embed/reporting/0834b41c-35fc-45ca-8d9e-07f08e085bb6/page/p_47spe0eyqd',true,NOW()),
  ('d1deb66a-0ffb-4af8-914c-92a977096e1d','DB www.audi-chatou.fr','96b590af-068a-4d0b-a52f-1ce8e27cb672','https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25807027979348%22%7D',true,NOW()),
  ('e3d75045-ef0c-46df-8fe1-ea96e69bb57b','DB www.audi-colmar.fr','96b590af-068a-4d0b-a52f-1ce8e27cb672','https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25804051076326%22%7D',true,NOW()),
  ('e972fb57-2428-4b49-91b3-bffd574fdf80','Prime Video Dashboard','0b935110-f7e6-4d60-8e62-e073fe64c079','https://lookerstudio.google.com/embed/reporting/3417596c-605d-4420-9720-a00023459759/page/p_2ugeb2pkkd',true,NOW()),
  ('eb672d50-7873-49cf-bf06-d5c35500b21c','DB www.audi-carepolis.fr','96b590af-068a-4d0b-a52f-1ce8e27cb672','https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF',true,NOW()),
  ('374d4d4d-95fd-460f-b9ed-27f1670d4d8f','DB Audi Partenaires','96b590af-068a-4d0b-a52f-1ce8e27cb672','https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF',true,NOW()),
  ('f80a5e2a-c52f-4a68-b3bc-8e7dd6d86eb0','DB Audi Concessions','96b590af-068a-4d0b-a52f-1ce8e27cb672','https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF',true,NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- DASHBOARD ↔ FRANCHISE relationships
-- _LookerDashboard_franchise: A=franchise_id, B=dashboard_id
-- Only inserted if the dashboard already exists
-- ============================================================
INSERT INTO "DashboardFranchise" (dashboard_id, franchise_id)
SELECT v.dashboard_id, v.franchise_id
FROM (VALUES
  ('1a9180dc-f156-414d-9e4c-82c6f3929524','6388e598-e6cc-418a-82aa-10374c24b1fd'),
  ('2dccd09f-be59-4cab-92d8-d1f746914a42','6388e598-e6cc-418a-82aa-10374c24b1fd'),
  ('58a35c4e-bdbf-4d18-99e7-791760f960f0','6388e598-e6cc-418a-82aa-10374c24b1fd'),
  ('bdcef5e8-ee36-43b1-ad2f-b12c95fd76bb','6388e598-e6cc-418a-82aa-10374c24b1fd')
) AS v(dashboard_id, franchise_id)
WHERE EXISTS (SELECT 1 FROM "Dashboard" WHERE id = v.dashboard_id)
  AND EXISTS (SELECT 1 FROM "Franchise" WHERE id = v.franchise_id)
ON CONFLICT DO NOTHING;

-- ============================================================
-- DASHBOARD ↔ USER relationships (key ones)
-- _LookerDashboard_user: A=dashboard_id, B=user_id
-- ============================================================
INSERT INTO "DashboardUser" (dashboard_id, user_id)
SELECT v.dashboard_id, v.user_id
FROM (VALUES
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','00f17ce6-0c65-4355-a9be-889aff912222'),
  ('c785c954-edc1-4b4c-bdaf-8c5b87559f69','0114d36e-800b-48c5-a276-b93712d7895e'),
  ('4f1da606-7db5-4fe2-a9fc-a9afd2905080','0fddab52-c2ab-478b-b1ed-39e1a854e195'),
  ('588c6bb2-cb80-4184-9909-72455c3c303c','0fddab52-c2ab-478b-b1ed-39e1a854e195'),
  ('17552791-7c73-4f88-b309-32cca0bb40bf','0fddab52-c2ab-478b-b1ed-39e1a854e195'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','0fddab52-c2ab-478b-b1ed-39e1a854e195'),
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','0fddab52-c2ab-478b-b1ed-39e1a854e195'),
  ('bd87cb63-7e77-4e75-89e7-a0d3a102885b','0fddab52-c2ab-478b-b1ed-39e1a854e195'),
  ('c785c954-edc1-4b4c-bdaf-8c5b87559f69','0fddab52-c2ab-478b-b1ed-39e1a854e195'),
  ('17552791-7c73-4f88-b309-32cca0bb40bf','1bd0c2e7-530d-4426-8aa6-eca75d3a3dbd'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','1bd0c2e7-530d-4426-8aa6-eca75d3a3dbd'),
  ('4554c6f2-7637-4c3a-9aab-d8f7b599f3c0','17eeb78d-a158-4ba8-893b-4506c63eb6ad'),
  ('c785c954-edc1-4b4c-bdaf-8c5b87559f69','17eeb78d-a158-4ba8-893b-4506c63eb6ad'),
  ('bd87cb63-7e77-4e75-89e7-a0d3a102885b','18d73cd3-0b66-40e4-9eb8-d9fb204549ef'),
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','1a62971f-7e76-4243-940b-a9b2ca1cca54'),
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','25c97eed-ce81-4b62-b68e-fef81e09dc38'),
  ('c785c954-edc1-4b4c-bdaf-8c5b87559f69','26abe6cd-a027-4c04-bf94-d9d42c8911e4'),
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','28dbc2a0-181d-4060-9a87-33552611291f'),
  ('c785c954-edc1-4b4c-bdaf-8c5b87559f69','2b7702e0-91d6-4943-96d4-5cc3fd572a37'),
  ('c785c954-edc1-4b4c-bdaf-8c5b87559f69','2bfb8648-26bd-4bd0-bd9f-26b82bfbda87'),
  ('bd87cb63-7e77-4e75-89e7-a0d3a102885b','2d399897-e030-4c4a-bfec-c64a40780529'),
  ('17552791-7c73-4f88-b309-32cca0bb40bf','2d4a14e7-034f-4e62-a44b-c2263d5e3797'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','2d4a14e7-034f-4e62-a44b-c2263d5e3797'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','2ef5e044-3c73-4f24-b688-13618848b785'),
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','2f8711ca-1b38-4a5a-8786-b8fece285a0e'),
  ('bd87cb63-7e77-4e75-89e7-a0d3a102885b','306d5400-f93e-48ef-8af9-5be5a6dabd39'),
  ('be61491e-357a-4055-9399-9b26c6611dcd','3106a64c-22c7-47a2-bb01-dde5123da61e'),
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','3e188d50-6910-4f7b-9a8c-7c4e4c380364'),
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','375aeac1-f652-41eb-9864-722ba96c532c'),
  ('c785c954-edc1-4b4c-bdaf-8c5b87559f69','3787a377-1e60-4568-808e-c5adbe13883c'),
  ('4554c6f2-7637-4c3a-9aab-d8f7b599f3c0','39ee24cc-ee8b-46fc-9281-20a633698529'),
  ('17552791-7c73-4f88-b309-32cca0bb40bf','365f99e0-85ba-48fc-9d9b-0d08c3eb898b'),
  ('193b79b3-a990-486d-8d6c-d061d439f5c6','4e6c124a-41d8-4ae4-895a-903090f05624'),
  ('17552791-7c73-4f88-b309-32cca0bb40bf','4e6c124a-41d8-4ae4-895a-903090f05624'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','4f42852f-7e16-4713-821f-a38ce9653763'),
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','507e7176-2c9a-4892-9fde-28699d6749f0'),
  ('3e6f55ec-0d73-4516-8cc2-6c4e908e0a26','546f30de-c12b-4ff9-a877-38f90c0b3a28'),
  ('67776bbf-e086-4ec7-b4ea-78ff8b774d07','546f30de-c12b-4ff9-a877-38f90c0b3a28'),
  ('e972fb57-2428-4b49-91b3-bffd574fdf80','546f30de-c12b-4ff9-a877-38f90c0b3a28'),
  ('bd87cb63-7e77-4e75-89e7-a0d3a102885b','547cf3f8-6115-4280-abf6-b8eb9356fb1e'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','567dfa5e-00eb-4d47-87b5-d2867a8c6692'),
  ('17552791-7c73-4f88-b309-32cca0bb40bf','5cfa0a79-9e5f-46f7-b702-13087ece05f3'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','5cfa0a79-9e5f-46f7-b702-13087ece05f3'),
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','62bb3421-2e46-47aa-ac5e-ae282b41aee8'),
  ('6edc1ac8-03f4-468c-877d-43531369c9e0','659e89f1-2cc1-4c51-9b9f-3e1a3a0cee9b'),
  ('c785c954-edc1-4b4c-bdaf-8c5b87559f69','659e89f1-2cc1-4c51-9b9f-3e1a3a0cee9b'),
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','660beda5-7363-4d0a-ac3b-cf9838f4db15'),
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','666cb497-908f-4ee6-9a57-f25276bdce70'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','67d2dfba-da09-4497-9bb5-995a18e51184'),
  ('522dfede-f57b-43ff-ad9c-630bc0895f49','69bcafb4-bd9e-40c7-b23e-fb3a56ba78b1'),
  ('588c6bb2-cb80-4184-9909-72455c3c303c','69bcafb4-bd9e-40c7-b23e-fb3a56ba78b1'),
  ('c785c954-edc1-4b4c-bdaf-8c5b87559f69','6ba257fc-f299-4a56-935e-594189f15808'),
  ('4f1da606-7db5-4fe2-a9fc-a9afd2905080','6e3f3f27-2d21-46a4-9a27-ed9b52bc1a8d'),
  ('522dfede-f57b-43ff-ad9c-630bc0895f49','6e3f3f27-2d21-46a4-9a27-ed9b52bc1a8d'),
  ('588c6bb2-cb80-4184-9909-72455c3c303c','6e3f3f27-2d21-46a4-9a27-ed9b52bc1a8d'),
  ('c785c954-edc1-4b4c-bdaf-8c5b87559f69','6e3f3f27-2d21-46a4-9a27-ed9b52bc1a8d'),
  ('17552791-7c73-4f88-b309-32cca0bb40bf','6ff1530c-60df-4381-982a-a5033c33c4b9'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','6ff1530c-60df-4381-982a-a5033c33c4b9'),
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','7264ba30-0324-4017-add8-eb9146d1ac70'),
  ('bd87cb63-7e77-4e75-89e7-a0d3a102885b','72bee5c1-a79c-47fa-b292-e8b058dd3c68'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','74687e9b-d449-482c-837a-12852e848864'),
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','75cbdc3d-68f8-4bed-84eb-b5a96084facf'),
  ('c785c954-edc1-4b4c-bdaf-8c5b87559f69','7c58907c-3a8b-44d4-b1d6-0335b5dbaed1'),
  ('bd87cb63-7e77-4e75-89e7-a0d3a102885b','7c58907c-3a8b-44d4-b1d6-0335b5dbaed1'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','7dd87eb0-47a9-4af9-a15b-416e026ab61d'),
  ('17552791-7c73-4f88-b309-32cca0bb40bf','809e9769-4874-4955-ab98-9a5a155adb97'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','809e9769-4874-4955-ab98-9a5a155adb97'),
  ('c785c954-edc1-4b4c-bdaf-8c5b87559f69','809e9769-4874-4955-ab98-9a5a155adb97'),
  ('17552791-7c73-4f88-b309-32cca0bb40bf','81908546-ece6-4198-bed2-25632031fbaf'),
  ('193b79b3-a990-486d-8d6c-d061d439f5c6','81908546-ece6-4198-bed2-25632031fbaf'),
  ('17552791-7c73-4f88-b309-32cca0bb40bf','851064b3-0dd5-40ce-ace1-1874c171837a'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','851064b3-0dd5-40ce-ace1-1874c171837a'),
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','8f66c1b6-e176-4cbb-81c6-07f2e487374d'),
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','911fd779-62af-4a32-8afe-be02eeb8de2b'),
  ('c785c954-edc1-4b4c-bdaf-8c5b87559f69','914cfc36-f5b6-4895-914f-ce38c6fe409f'),
  ('17552791-7c73-4f88-b309-32cca0bb40bf','95f772e3-8a10-446c-a5c4-e33dbd2668af'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','95f772e3-8a10-446c-a5c4-e33dbd2668af'),
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','97376a88-6958-49e7-91a5-1371a49ad4a6'),
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','9b41adf6-7f57-462c-be9f-1201e8fd6557'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','9c501181-fbfd-4059-8ea7-8e40c17656cc'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','9cf4a684-8e2a-4b92-b406-3d679d6673eb'),
  ('bd87cb63-7e77-4e75-89e7-a0d3a102885b','9f6598c9-09cc-4e26-889e-5d0f454829c8'),
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','aa17e0a0-636b-48ad-ab93-93dc01200b25'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','ab8ad8bc-ea9f-42c2-a1ec-c1ecd16a7eec'),
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','adf1e1f6-f0cb-463d-ad8c-eae647039092'),
  ('79f8e18b-172d-455f-a6f4-3489cb53ef3b','bd953bca-7577-4205-b1f3-28513edb1463'),
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','be466540-c1c8-4d5b-89cc-77dd4fc34364'),
  ('4554c6f2-7637-4c3a-9aab-d8f7b599f3c0','bf0a5dc1-feab-4add-9a43-3866b083f326'),
  ('be61491e-357a-4055-9399-9b26c6611dcd','bf0a5dc1-feab-4add-9a43-3866b083f326'),
  ('c785c954-edc1-4b4c-bdaf-8c5b87559f69','bf0a5dc1-feab-4add-9a43-3866b083f326'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','c3687d84-657b-4c96-b25f-8579ee290b8c'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','c98b4e5a-3dea-491f-8be4-30a140266c24'),
  ('bd87cb63-7e77-4e75-89e7-a0d3a102885b','cb6250f9-9bd4-4142-8574-a8aaeb9b387e'),
  ('17552791-7c73-4f88-b309-32cca0bb40bf','cc68ccf9-5949-4caf-a1df-71b44625f38e'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','cc68ccf9-5949-4caf-a1df-71b44625f38e'),
  ('bd87cb63-7e77-4e75-89e7-a0d3a102885b','ce5ffb16-6b45-4a6f-8a86-574dfa52b84f'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','d1b1cf51-b3b1-49a1-8c5c-0d695765b085'),
  ('17552791-7c73-4f88-b309-32cca0bb40bf','d1b1cf51-b3b1-49a1-8c5c-0d695765b085'),
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','deb88ae6-547d-40c6-8d16-51206e947daf'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','df391d51-4942-45b2-b803-44d1caa6dae4'),
  ('17552791-7c73-4f88-b309-32cca0bb40bf','dfbea79c-cb47-4cd4-a723-cf574e5afc01'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','dfbea79c-cb47-4cd4-a723-cf574e5afc01'),
  ('c785c954-edc1-4b4c-bdaf-8c5b87559f69','e0119503-c278-4d16-880d-142c4e58ff40'),
  ('c785c954-edc1-4b4c-bdaf-8c5b87559f69','e25cab5a-cfe7-47ce-ad81-ade24f6823cd'),
  ('bd87cb63-7e77-4e75-89e7-a0d3a102885b','eb947812-3ebb-4d5c-95ea-fb0bf4607950'),
  ('c785c954-edc1-4b4c-bdaf-8c5b87559f69','ef36b0f0-b30b-43c5-b510-221c1227310b'),
  ('c785c954-edc1-4b4c-bdaf-8c5b87559f69','f49ef0f4-f04b-4bc9-b74c-79c39d919c71'),
  ('374d4d4d-95fd-460f-b9ed-27f1670d4d8f','f80a5e2a-c52f-4a68-b3bc-8e7dd6d86eb0'),
  ('c785c954-edc1-4b4c-bdaf-8c5b87559f69','f9b53699-f9a2-4755-9d7e-0cf087a94ccf'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','7890e939-d641-4047-9bc1-7b9cd3811a18'),
  ('92d22bde-1f8e-4ee6-8977-7663e994c145','7b0a252c-b44d-4e14-9081-75c81274a2f4'),
  ('c785c954-edc1-4b4c-bdaf-8c5b87559f69','c6c7b636-f7bd-4a24-9fcf-5d12ba7b0b44'),
  ('1f9d576a-8059-433f-93d1-b0ccc2b2c937','ae9aabba-3e7e-45e5-8dc3-2863d686e600'),
  ('17552791-7c73-4f88-b309-32cca0bb40bf','81908546-ece6-4198-bed2-25632031fbaf')
) AS v(dashboard_id, user_id)
WHERE EXISTS (SELECT 1 FROM "Dashboard" WHERE id = v.dashboard_id)
  AND EXISTS (SELECT 1 FROM "User" WHERE id = v.user_id)
ON CONFLICT DO NOTHING;

COMMIT;

-- Final count
SELECT
  (SELECT COUNT(*) FROM "Company")        AS companies,
  (SELECT COUNT(*) FROM "Franchise")      AS franchises,
  (SELECT COUNT(*) FROM "User")           AS users,
  (SELECT COUNT(*) FROM "Dashboard")      AS dashboards,
  (SELECT COUNT(*) FROM "DashboardUser")  AS dashboard_users;
