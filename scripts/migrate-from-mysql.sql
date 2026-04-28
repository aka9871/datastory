-- Migration script: MySQL (old KeystoneJS) → PostgreSQL (new Datastory)
-- Run with: psql $DATABASE_URL -f migrate-from-mysql.sql
-- Safe to run multiple times (ON CONFLICT DO NOTHING)

BEGIN;

-- ============================================================
-- COMPANIES
-- ============================================================
INSERT INTO "Company" (id, name, slug, domain, has_franchise, created_at)
VALUES
  ('0b935110-f7e6-4d60-8e62-e073fe64c079', 'Prime Video',      'prime-video',       '',  false, NOW()),
  ('3949e1fd-f574-4271-a642-c9ab54c18737', 'EDF',              'edf',               '',  false, NOW()),
  ('3e43e563-f69e-4573-8285-7283915a662f', 'Audi',             'audi',              '',  false, NOW()),
  ('583b6953-b97e-41c3-9dd5-70ffc20cb93d', 'McDonald''s',      'mcdonalds',         '',  false, NOW()),
  ('7319b938-85a2-4094-a419-39c50a78cae8', 'SEAT/CUPRA',       'seatcupra',         '',  false, NOW()),
  ('79453ad2-06a6-4886-aeb5-0a0e9bcc29ed', 'DDB',              'ddb',               '',  false, NOW()),
  ('96b590af-068a-4d0b-a52f-1ce8e27cb672', 'Audi Concessions', 'audi-concessions',  '',  false, NOW()),
  ('d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229', 'Samsung',          'samsung',           '',  false, NOW()),
  ('ecb3221b-4bd0-4093-8b13-d50c800da80b', 'AAE',              'aae',               '',  false, NOW()),
  ('fad2a3fe-ad82-47f7-b028-f63beadd6b2c', 'BBDO',             'bbdo',              '',  false, NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- FRANCHISES
-- ============================================================
INSERT INTO "Franchise" (id, name, company_id, code, address, zipcode, created_at)
VALUES
  ('6388e598-e6cc-418a-82aa-10374c24b1fd', 'Groupe Jeannin', '96b590af-068a-4d0b-a52f-1ce8e27cb672', '', '', '', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- USERS (role mapping: role_admin→admin, role_user_brand→brand_admin)
-- Emails are lowercased for consistent authentication
-- ============================================================
INSERT INTO "User" (id, firstname, lastname, email, password, role, company_id, franchise_id, is_active, created_at, updated_at)
VALUES
  ('00f17ce6-0c65-4355-a9be-889aff912222','Margaux','Trevisan','m.trevisan@samsung.com','$2a$10$H74rDzPAIYcKgrR7cTRt.eYIboDyJkSq2ER2rIAGx1L0HgoLk8YMO','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('0114d36e-800b-48c5-a276-b93712d7895e','Matthieu','Mauricio','matthieu.mauricio@seat-cupra.fr','$2a$10$6QTASsNOtppbkguCUdNzK.73v0alGu2eOe/gS5rPZDnbj40hcGvli','brand_admin','7319b938-85a2-4094-a419-39c50a78cae8',NULL,true,NOW(),NOW()),
  ('01fcfd21-b66c-40f2-ae1c-dfc29834fd61','Carole','PAULET','cpaulet@vwjl.fr','$2a$10$bf24v.upyp/L8GQzmLBsse2/r4aUsWiMlfLynPchnS..aykkWpYEm','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('03573882-5c7a-485a-9f5b-4bcbfd120b83','Julien','Richard','julien.richard@ddb.fr','$2a$10$KQaDNQCwqJ3qxKjCU4qdKeJ1sJLpPlxL1yMRy8vZfOIqG788X0YKu','admin','79453ad2-06a6-4886-aeb5-0a0e9bcc29ed',NULL,true,NOW(),NOW()),
  ('081964c7-91f1-4e0a-b257-b89b023579a1','Eva','Lopes','lopes.eva@partner.samsung.com','$2a$10$pj8pwPpQtzrkvOxMUfUVheLzq2i32u8RILTaK4GVEjNMOQEuycxjq','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('08d90ed1-6c87-4031-a246-0bfffe38c589','Enzo','BENAIGES','enzo.benaiges@tressol-chabrier.com','$2a$10$kB3Th0FKwOwgizAw4P61j.vuYhMKz.TQQIpFXCW2z3TnTSFEeNI4q','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('08e97058-fcdc-4710-b9ac-7ae7491d2032','Jérémy','MAINGRE','j.maingre@bymycar.fr','$2a$10$3yG44LxUaE1fGCFCQPAGjeAFnzrlyaKm3CplOT9xpW9J5nSheLXLe','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('09c9d69d-b67a-4131-87aa-f378424b62ec','Stéphanie','Kahn','steph.kahn@samsung.com','$2a$10$GkGXmrzMPWBN.Vxw8JwJZOUyjKUHf0CUBi0aSQAhfr51uYXCNzJui','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('0a33e842-db71-4e04-8787-5cd819cb66ec','Mélanie','Wagner','melanie.wagner@ddb.fr','$2a$10$x7qf04y3kStFeHY2ZzKBpuU/sPuPTNCcxy1bVSlQXGoo3/bJjLp52','brand_admin','7319b938-85a2-4094-a419-39c50a78cae8',NULL,true,NOW(),NOW()),
  ('0c480497-b0a6-40a4-ba7e-3c33c2fd8038','Mathilde','De Freitas Morna','mathilde.defreitasmorna@ddb.fr','$2a$10$3dU6Ti0vx6pwTqpBXOA7Cu5PJ6W8l9oNpB8fZcx9TgoufdOwEP9eq','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('0c6ce813-1391-40f6-8b10-119a482d11df','Elise','Lassimoulie','elise.lassimoulie@ddb.fr','$2a$10$MvNqBZ8rhyYHUPrzzG9snO1N9AC/l65kWjP7tAovwgwfEnCteF02K','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('0cc17899-3488-49db-9928-c7ac7b36717f','Margaux','Picard','m.picard@partner.samsung.com','$2a$10$FVSlorIloJbxm9.okfqU2eMO8866FVALk/ddVdUJ.elOKh4gEwcVm','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('0fddab52-c2ab-478b-b1ed-39e1a854e195','Camille','Fischer','camille.fischer@ddb.fr','$2a$10$QuyZSzFa05Lpr9A9ckKBguJ5Mq2jWK5DIjuHiON0TGp24UQelpLL2','admin','79453ad2-06a6-4886-aeb5-0a0e9bcc29ed',NULL,true,NOW(),NOW()),
  ('102eb189-0103-4315-a74d-88314de1c587','Julie','DEBARBAT','j.debarbat@bymycar.fr','$2a$10$Jg7I8/3gFvYXVIr94vy30uqj/zxG/FnxDTxEXu7pHbSVZ6/ZzMzSe','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('11c349e1-6683-4238-9a20-5b316dcb84dd','Olivier','MURACCIOLI','oliviermuraccioli@gmail.com','$2a$10$tFYVvJYDqX4iyI9W11kP/eWWPCntGsZ9zzSlsdopx7u4nC3kyYRFW','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('17e1485e-7650-4647-9d22-d23ca4ddd5a3','Marie-Céline','VIALLA','marieceline.vialla@ravon.fr','$2a$10$807yXyluUxApzeUtBs/xJunlHR5nin9dk4WhExwdwkQLzwNcuKrBm','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('17eeb78d-a158-4ba8-893b-4506c63eb6ad','Ali','Khedji','ali.khedji@tribal.paris','$2a$10$4jRwirplSGjTLQyuXsqZQe/RPP16IQYt2PbTqhqIumxxQGHP1IDjW','admin','79453ad2-06a6-4886-aeb5-0a0e9bcc29ed',NULL,true,NOW(),NOW()),
  ('18d73cd3-0b66-40e4-9eb8-d9fb204549ef','Marion','Floch','marion.floch@romance-agency.com','$2a$10$6jr.XUt1E7Fvlvo5dGqEJOyDUu/X/8E7IlSbQEQcC3prPJyvMNWcC','brand_admin','ecb3221b-4bd0-4093-8b13-d50c800da80b',NULL,true,NOW(),NOW()),
  ('1a62971f-7e76-4243-940b-a9b2ca1cca54','Jennifer','Merille','j.merille@samsung.com','$2a$10$DGY2Bh/SHOL0Yf5bUI18XOTx9.C2xDYQTda6tPsr7Y77IQ98K2E3G','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('1bd0c2e7-530d-4426-8aa6-eca75d3a3dbd','Aïssata','Diallo','aissata.diallo@audi.fr','$2a$10$x66ay8fG7p0Kc5QkkxZzlObHx2VIASu9rS540Y6QnzGDwzMD2A/VC','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('1d16b3ca-5793-446d-ae81-7f3c3458ec70','Antoine','PASTAUD','antoine.pastaud@car-automobiles.fr','$2a$10$dx2z7ihJn/7oJ3EyXBhA1OWl4XWPxtFEkWv4rEa9CzDMLqwo25Ly6','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('1d98a20b-8941-4078-86bf-476721cb82d3','Isabelle','DESMOULIN','isabelle-desmoulin@pericaud-automobiles.fr','$2a$10$LJ0GrQh6j72XOmFjD0ahEeKcjVQEpfpAe78s54u3Fe62H8Sz2CtOu','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('1efc4d5a-f5d0-4875-bc48-9b43ebca98cd','Claire','ASSOULINE','claireassouline@autosudbernabeu.com','$2a$10$bcPQ2vKhSz6Tp5XjN97wgeqFftJF22D.kLBiAdWAg386Fw.Gs.Yiq','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('212d4593-b30c-4898-a705-424125daedef','Clément','HOLONNE','clement.holonne@scalagroupe.com','$2a$10$UUzPNjxpOxMDGAWn/3lVVepN8CmRRapv4h9PFnogjc5PkberbLDiC','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('226aa4b4-99a3-4d06-a805-bc0ed710734d','Pierre','TARDIF','p.tardif@garagemoderne.fr','$2a$10$EZYZ4trdyyCIU7x3rpAIx.abI6e4GSl9lZN7tHKNAOFmuFgcEykZq','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('2348162d-2941-4a3a-8f88-8c813e389cf9','Perrine','Marchal','perrine.marchal@re-mindphd.com','$2a$10$VcL0qinZ84ZJ/g4ILEokcOSIfkvLqs..xlvDyq1seEZhbvLj5mIZu','brand_admin','7319b938-85a2-4094-a419-39c50a78cae8',NULL,true,NOW(),NOW()),
  ('25c97eed-ce81-4b62-b68e-fef81e09dc38','Emilie','Courtois','e.courtois@partner.samsung.com','$2a$10$hU46hnGlhtsAoHamXGozquPSc3RtHADSVKCZSLb.r38t6LM2NQ5OO','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('2668a2e3-ac30-4a56-a428-7759ccb182a5','Super','Admin','yassine.falkani@ddb.fr','$2a$10$lWA5AcifbK6JkqnQSrHpn.KDbFw2PwVamtY4k8lOs65r1aREEdggq','admin','79453ad2-06a6-4886-aeb5-0a0e9bcc29ed',NULL,true,NOW(),NOW()),
  ('26abe6cd-a027-4c04-bf94-d9d42c8911e4','Kenan','Labussière','kenan.labussiere@ddb.fr','$2a$10$EaXm1RptRZTmM5gAvOjFFOhdBuuZ3/hopwu.CuC/3i7WirIhPKbxG','brand_admin','7319b938-85a2-4094-a419-39c50a78cae8',NULL,true,NOW(),NOW()),
  ('26fb82d2-79fd-4d0a-8f12-d304de799524','Mathieu','GANTOIS','mathieu.gantois@espace3000.fr','$2a$10$dnX.hih.lMJARDALKazjXer/4hbRT8sY8Mow4hULrNa/te8fmnETm','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('28dbc2a0-181d-4060-9a87-33552611291f','Enzo','Tranchando','e.tranchando@samsung.com','$2a$10$QpTU2YHvQznFbECx3G.KlemW2kyTIetiWDrOUkvybpu/De5y1vGPa','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('2b7702e0-91d6-4943-96d4-5cc3fd572a37','Pedro','Fondevilla','pedro.fondevilla@seat.fr','$2a$10$3E1JO5z3b7PKLX55TdC8z.PjWzSmbAhxAM1gnBIHL18Ll1ekxIaTy','brand_admin','7319b938-85a2-4094-a419-39c50a78cae8',NULL,true,NOW(),NOW()),
  ('2bfb8648-26bd-4bd0-bd9f-26b82bfbda87','Ines','Tadrist','ines.tadrist@re-mindphd.com','$2a$10$bEEo1UybVVx7bMY/HR.ONeIWDdfjcXAGa71L4X/YMPrk5lgu9IRem','brand_admin','7319b938-85a2-4094-a419-39c50a78cae8',NULL,true,NOW(),NOW()),
  ('2d399897-e030-4c4a-bfec-c64a40780529','Sarah','Holgado','sarah.holgado@romance-agency.com','$2a$10$8Ot.6Hl0gFyo3bpmUN6Nl.fRfspsANZAx98EgZ1D7m6RKz9NvZFW6','brand_admin','ecb3221b-4bd0-4093-8b13-d50c800da80b',NULL,true,NOW(),NOW()),
  ('2d4a14e7-034f-4e62-a44b-c2263d5e3797','Stéphanie','Cantau','stephanie.cantau@audi.fr','$2a$10$5WF5fN8NCPkSyqaQoi/jaez4bYUT6Ex8Lnv2SblB.tE9EudOgpZ7G','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('2e995fe8-9cfa-41c8-8ed6-5e110804609b','Astrid','DUFLO','a.duflo@amixia.fr','$2a$10$DgU8QrgLiwIUO35zUTym8uXDOXkm.wnePHPMAvRX9U6mWaeDHnXZC','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('2ef5e044-3c73-4f24-b688-13618848b785','baptiste','Simeon','baptiste.simeon@omc.com','$2a$10$m1bBR/M65e.awLAiWvQSGexlTSqTxGMpeQdeUJz1pkYJJygHtYdIC','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('2f8711ca-1b38-4a5a-8786-b8fece285a0e','Delphine','Margato','d.margato@partner.samsung.com','$2a$10$.fb0tGkux6BiToOD6H2RFOWcGfCqKv62cg5ygpnXsq7g1/bQdJ3b2','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('306d5400-f93e-48ef-8af9-5be5a6dabd39','Kilian','Ruez','kilian.ruez@intradef.gouv.fr','$2a$10$kPdSgtaYRhp3bHbJFsdxVO5cEnzBGOIXQHDI/2P04J0PZyLqrqS8S','brand_admin','ecb3221b-4bd0-4093-8b13-d50c800da80b',NULL,true,NOW(),NOW()),
  ('3106a64c-22c7-47a2-bb01-dde5123da61e','Equipe','McDonald''s','equipe@mcdo.fr','$2a$10$.UrokcV/Pu./a1IbiqRjtuTzEgXsUzES.bZllmZC0y9mzreHr2/gS','brand_admin','583b6953-b97e-41c3-9dd5-70ffc20cb93d',NULL,true,NOW(),NOW()),
  ('33440802-f4e2-48a2-b913-1a7da324be4e','Rose','DANREE','r.danree@bymycar.fr','$2a$10$34UO9O08WU/DxYJRsufHO.1OitqT7BNBHUjt9mVSXFSkoYJS34NPG','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('339828ab-ff82-4486-a323-0f60ddc7d189','Test','AK','antoine.kuhn@omc.com','$2a$10$7FCqZnfyAHXTnaB/E3Src.KW0iLHUqGqtPiXS9jVPN7tQ/w0pH1NK','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('33c27d49-2f0f-4c27-a70b-2264494cd072','David','JANIN','david.janin@groupedonjon.fr','$2a$10$sDD86HyMkN0tTjnlOME16.A9racKWLVuFU.4jz2s/hctsH.PZv//2','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('340dacaf-1c88-4e2b-8242-21ccb899ac22','Léonie','ROUX BOZONNET','l.roux@rxautos.com','$2a$10$lWfCRTzExGbNTzVnBPwwquMDgMeSCMOx2ycW5T2NdvYzk16jWhokG','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('365f99e0-85ba-48fc-9d9b-0d08c3eb898b','Thomas','Vassort','thomas.vassort@tribal.paris','$2a$10$ftfItqClKcxT1CPZdUB4J.aBSbmKEYtBq30RpaQ8qzqi7yMKa7gFa','admin','79453ad2-06a6-4886-aeb5-0a0e9bcc29ed',NULL,true,NOW(),NOW()),
  ('375aeac1-f652-41eb-9864-722ba96c532c','Roxanne','Simonnet','r.simonnet@samsung.com','$2a$10$Se4MLMBD7qWgJ3FIw1bcLeF9auTBzH2Bp2M92q51DK0u7B2Wm5u7a','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('37744d34-cce5-4f35-8343-b4e3798ea2af','Ali','Khedji','ali.khedji@omc.com','$2a$10$IIKtHPIIeb/LIzXHF5KekeciKFdlQ8vyXAobOlgcNb5zie3vKSEKC','admin',NULL,NULL,true,NOW(),NOW()),
  ('3787a377-1e60-4568-808e-c5adbe13883c','Pierre-Arthur','Cavelier de Cuverville','pierre-arthur.cavelier@re-mindphd.com','$2a$10$3Z.i43ffv2PRoWJOsdljd.fyFsEX2.8CAigWO/140R3zXU2nTTEjS','brand_admin','7319b938-85a2-4094-a419-39c50a78cae8',NULL,true,NOW(),NOW()),
  ('39ee24cc-ee8b-46fc-9281-20a633698529','Geoffrey','Tournevache','geoffrey.tournevache@fr.mcd.com','$2a$10$Z7MxiQBkKvMl/Z9L7txThOaf/cUWnmUuhEg0EpFQjtnNLvsHPnFJe','brand_admin','583b6953-b97e-41c3-9dd5-70ffc20cb93d',NULL,true,NOW(),NOW()),
  ('3c18feae-f4b7-44a6-b885-da25b8e065ea','Taous','AGRANIOU','t.agraniou@jeannin-automobiles.com','$2a$10$J9Jbz8.gbKZUYnCD.SXb7uVnrIDRfYXYr.oSK8zyAoSxpRQqPEzwa','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('3c92b966-80ae-4fb0-82a8-161b9182823f','Etienne','Noinski','etienne.noinski@audi.fr','$2a$10$AjQS65.Xl7A8.GfUBoXRQ.fE8l.Af18vVSvy7tWnIato1GZ7Mpali','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('3ca4e585-7fda-4b87-879b-93f0bea416aa','Alice','THUOT','athuot@jeanlain.com','$2a$10$ZEoQzbAptq68NbXYUfsAKu62TOQful5AOBjWiZKn2aKU9meS.xuXi','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('3cbc64a3-12dc-4a53-b163-4c9519025bba','Aurélie','FORTUNE','marketing-gvf@groupejb.com','$2a$10$bSlVt9FqO3vZQIzio2ZvKuGxYnXQKwqPKZAil6ovmlbYaSYzJuZdu','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('3d8e1c32-179a-470a-b8f7-da63ed34d1a3','Olivier','GAYRAUD','o.gayraud@bymycar.fr','$2a$10$WOkAYlu0v95SO5vaSfbY2.CSQYazVFYGn9vE0c5BF0LR7a0Sci/e6','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('3e188d50-6910-4f7b-9a8c-7c4e4c380364','Benjamin','Chambe','benjamin.chambe@ddb.fr','$2a$10$erIS950bhopv3qqeNBfkeOXQLt7BMgBd5P8BLaRc8yalybSf.B5pG','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('40b91ffb-0604-4d58-99d7-5af4a4f8d397','Social','Media','social@mcdo.fr','$2a$10$1b4yH..AYJHEq1h7lizFBOvoqg7Ydgzt1.xnKJZw9cuTuoWAChrqC','brand_admin','583b6953-b97e-41c3-9dd5-70ffc20cb93d',NULL,true,NOW(),NOW()),
  ('40c7ee4b-6d8e-416f-92bd-0a4aeea23e94','Anne-France','LELEU','af.leleu@saintmarcel-laon.com','$2a$10$jp2Wh.ceU7qK2/nDLreJZu6/uIXzXwWOmS8n/3WKHi3pF1XfPZxRm','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('42d87538-56d1-4b01-acbf-50c1aa881feb','Rémi','GAUTIER','remi.gautier@pldauto.fr','$2a$10$joZE4hQVNIj8IH9x6mUhmuIQSkImXWo8IlkxPXA72zXq8usS3JHsK','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('492e30c6-e484-4834-82cd-42c0ff415b7d','Laure','LASAUSA','laure.lasausa@car-bayonne.fr','$2a$10$2L02SF0m3j9s6pTlstncPeVTzs2IlLcEoSl82qAmu3YlzP3JVxAG2','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('49b919ed-96fc-4e66-a5e1-7ac80f3d3750','Pauline','JEANJEAN','pauline.eysseric@centralautos.fr','$2a$10$ngjWZRl/JMsyj/.2t7Uf1.L4c0jsC3JH8opqudsXeD7E2C8Xt8EKe','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('4bee902b-0959-4da3-a3be-0acbeed33fc6','Marine','ROHFRITSCH','marine.rohfritsch@passionautomobiles.fr','$2a$10$Z3GVm/R12xmNmaTG1NumQ.YsoFEPQwktcgTPr9aSHyFlWokLv2P8W','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('4c8d641a-5cbf-49b2-ae9b-77e8f94e57aa','Lucas','LEGRAND','lucas.legrand@groupe-poirier.fr','$2a$10$Hg5t397kPKdnSj0/PLJFBeNEocgVWCGS1Tpa45jjpQ7LY7ezUvYi.','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('4d6b252c-ae54-4c7e-9593-eeabc0a19a01','Elise','THOREL','elise.thorel@vikings-automobiles.fr','$2a$10$mDNyzAl7HtaL/BdAsiOus.7mIIfYXX8SGiAr1elKtnnC0RWs9Uo0u','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('4db75af5-cdf3-42b1-a116-36e46f3cd7e3','Antoine','VIGEON','antoine.vigeon@daniel-mouton.com','$2a$10$i8a/OY58NUODqvu4nijGFuSlBKPnGfd9XenG4WSNcVxiJwbwAB1Iu','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('4e2b51a6-f5c6-4221-a419-0483472f7acd','Romain','Lorthiois','r.lorthiois@samsung.com','$2a$10$rXorxIhfUYv2yyNcdgJ8Y.ziT.hTNqL0kM/2cGaN4oLY84NZo8/qm','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('4e6c124a-41d8-4ae4-895a-903090f05624','Bettina','Ried','bettina.ried@audi.de','$2a$10$inFsZ2JxJQW2XJTDhFtfMOZN0hzwBdLYJhxWqqr0YBgU2YaQEBWy6','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('4f42852f-7e16-4713-821f-a38ce9653763','Emeric','Eymard','emeric.eymard@audi.fr','$2a$10$OpqZNMTNuEzvidTdSneSXeV.78JYYoHp0AI8Nrg1dksIUQ0K2.gRu','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('507e7176-2c9a-4892-9fde-28699d6749f0','Emmanuelle','Marques','emmanuelle.m@samsung.com','$2a$10$eKUp4Mr30KQJ5JiqFrolveJCKacWa/wxLVFFYHcUlllKsmcFqwvZm','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('50ab46fe-c30d-424c-b028-a3bd963d4aff','Benoît','DOGNIEZ','bdogniez@groupewarsemann.fr','$2a$10$8qPTWCRc0gW5oxwlKqXz2.rcj3W033gsQLV0PwsvOtASAVJ5xsD7O','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('50b82417-694e-41ba-a42a-c10b3c6503ad','Marion','Floch','marion.floch@omc.com','$2a$10$IzFCPXCpRpfxcFH9j25iZOlyJKLpJuytwmu.xCLndR7K/s7fC.ktm','brand_admin','ecb3221b-4bd0-4093-8b13-d50c800da80b',NULL,true,NOW(),NOW()),
  ('5234f2e2-94c5-4497-86e7-491828bcabdb','Jasmine','Abdoun','j.abdoun@samsung.com','$2a$10$BaOE2GbcAa3vIbEUK84/NuAyZVC.7OIktNyYvavkYLMxSssYqP8SK','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('546f30de-c12b-4ff9-a877-38f90c0b3a28','Prime','Video','team@prime.com','$2a$10$Yi0ZHteOpFj7H0UeomtrEeBZj9YbpXK5rntQZbqSSeETeWg3wK/e2','brand_admin','0b935110-f7e6-4d60-8e62-e073fe64c079',NULL,true,NOW(),NOW()),
  ('547cf3f8-6115-4280-abf6-b8eb9356fb1e','Jennifer','Medeiros','jennifer.medeiros@intradef.gouv.fr','$2a$10$BUaoJYaS3htmI8vuBjWeqejDQ/l3RZCWA/K2SHkoQzORngcMF2h1W','brand_admin','ecb3221b-4bd0-4093-8b13-d50c800da80b',NULL,true,NOW(),NOW()),
  ('567dfa5e-00eb-4d47-87b5-d2867a8c6692','Axel','Collet','axel.collet@audi.fr','$2a$10$xB.HbN5U9uSENpZtGbgRmeehdxlvlODmMP6nfH7ZrffqdQuI7Db3a','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('57017d59-aecf-411b-92bf-b81a26f37596','Anthéa','BLONDEL','ablondel2@gueudet.fr','$2a$10$7eRm.H.eiu5EV1WlxCVoIuK1oj./he8MXU2oQfvWVB79z6vaXEXKu','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('5af9076a-70a7-4c61-96fc-2945ca8c8214','Baptiste','Tibaron','baptiste.tibaron@tribal.paris','$2a$10$c7gdsqEs3kDVF2q5r0cz3OKsKnLh0q/ZD/OA.vJWmHzIQQbf.fPSi','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('5b8a8204-94a3-4115-af11-5f8b0ca53f0b','Jessica','VERNIORY','jessica.verniory@carepolis.com','$2a$10$5GTgr31yo/HMtg7JQYqr2Ou4diKkMaw7cvxYacaTP4tjCfYrEDKhu','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('5cfa0a79-9e5f-46f7-b702-13087ece05f3','Robert','Breschkow','robert.breschkow@audi.fr','$2a$10$0G4gb18Z0ndsTRoI9NXg6uPd0.E7IYpa.MXWgMBkrkvNNDmDWrkFO','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('5f6f443c-f73d-47bf-9bff-9ef6bc8cb4f9','Camille','Test','fischer.camille@gmail.com','$2a$10$fuPmihKbME28/wL8y.AmQu39Lz5MuzLhwyrAKYEmpCLKkfl3rUQOK','brand_admin','79453ad2-06a6-4886-aeb5-0a0e9bcc29ed',NULL,true,NOW(),NOW()),
  ('62bb3421-2e46-47aa-ac5e-ae282b41aee8','Axel','Renaudin','axel.renaudin@ddb.fr','$2a$10$YwnUGKr0CbaV0dBRXwI/NeSNzxuaU7cILgz/qvgiuCYxx64l2JXiq','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('659e89f1-2cc1-4c51-9b9f-3e1a3a0cee9b','Jaimie-Lyne','Jovial','jaimie-lyne.jovial@omc.com','$2a$10$V68FkFZY4j0UmkLUEoUVEuctzo2yLYTjpAIiTAUcEX6na.nQYNiHW','admin','79453ad2-06a6-4886-aeb5-0a0e9bcc29ed',NULL,true,NOW(),NOW()),
  ('660beda5-7363-4d0a-ac3b-cf9838f4db15','Thanh-Nhan','Ly Cam','thanh-nhan.lycam@omc.com','$2a$10$QFcS5I0q9B5ujVnSsoG0iu0uBPAT64ZidFKg5cFg5g2zQpRdHxjty','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('666cb497-908f-4ee6-9a57-f25276bdce70','Maryline','Bererd','m.bererd@samsung.com','$2a$10$DuetaMKWQUzuv209kwgdOO9XvkSkjs5SGTyWCeFUZe3MUIoSqVGMy','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('67d2dfba-da09-4497-9bb5-995a18e51184','Mickael','Assie','mickael.assie@audi.fr','$2a$10$HtpCISbLMo7Fy2yKMcQ9Guw087ZAc6AYaGjrHuOWnb/spyomlBKyi','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('69bcafb4-bd9e-40c7-b23e-fb3a56ba78b1','Margaux','Poulain','margaux.poulain@tribal.paris',NULL,'brand_admin','79453ad2-06a6-4886-aeb5-0a0e9bcc29ed',NULL,true,NOW(),NOW()),
  ('6ba257fc-f299-4a56-935e-594189f15808','Juliette','Pham','juliette.pham@re-mindphd.com','$2a$10$XHTONSxzbN7Am12iBoF0zeiKOY4JBxHOXB5eN3YmR3O1zuUSr0ZNu','brand_admin','7319b938-85a2-4094-a419-39c50a78cae8',NULL,true,NOW(),NOW()),
  ('6d66faae-fcdc-4484-92b8-d2b4c76188b8','Clara','GOUMARRE','clara.goumarre@audiarles.fr','$2a$10$CgmJSi6TSDOFDs8CJshoie01N14W85QMGRvLscz3GcCfH3gFlGr3u','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('6e3f3f27-2d21-46a4-9a27-ed9b52bc1a8d','DDB','Analytics','ddbparis.analytics@gmail.com','$2a$10$smLSmrM3NYOoTJN8VHV9guCG/z1.S.5/w.KbuCAvzjBr7.RxpTsz2','brand_admin','79453ad2-06a6-4886-aeb5-0a0e9bcc29ed',NULL,true,NOW(),NOW()),
  ('6ff1530c-60df-4381-982a-a5033c33c4b9','Audi','France','equipe@audi.fr','$2a$10$tGqtaWkTQyqGKkqUq2hUwuA9N8DLGkiaiUA9TMXKYURdRoSRkgizC','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('700c0080-960e-4f9f-961f-db8f49e012bf','Margaux','FONTAINE','margaux.fontaine@morbihan-auto.com','$2a$10$n6kM167sEzCw9lqyRIaCAei.LfnlolyL7HkfSqV6uSOGYFlQdL97i','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('7264ba30-0324-4017-add8-eb9146d1ac70','Arthur','Monteilhet','a.monteilhet@samsung.com','$2a$10$Ox9EbsIQoNXEnJAf1CXcjetJ.nkO8EXhPUhNnZ5eLYfdoGWWbkmDS','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('728dba15-b7c9-425a-ad20-4bb4cb7e10b9','Jade','MAMET','marketing@espace-saint-maximin.fr','$2a$10$9owN8Sd0q/KmQmzW0Uxmu.nuXwyjkfR2QorMpEmCkgIk43ClCdb.6','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('72bee5c1-a79c-47fa-b292-e8b058dd3c68','Michel','Koch','michel@tune-up-consulting.com','$2a$10$vEfXI1YUEHBhtk2TPmJ4nOcjlfZv4aq7/814X2mXqJ0jzxve.m9QS','brand_admin','ecb3221b-4bd0-4093-8b13-d50c800da80b',NULL,true,NOW(),NOW()),
  ('74687e9b-d449-482c-837a-12852e848864','Khelil','Aibeche','khelil.aibeche@re-mindphd.com','$2a$10$Dh3U.Rf0hz/xuxZm1/4R0OGYbbdF8hWdgrjImv0hisGAD04L9y8FK','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('75cbdc3d-68f8-4bed-84eb-b5a96084facf','Maureen','Monteiro','maureen.monteiro@ddb.fr','$2a$10$Vb37ikDXJGML1rI/QMpzJOxAdeDB2YJZgeK1xrkVTZtVNdl3aSdpm','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('76f3ced5-281f-40ce-a0e1-2f709bd77683','Mélanie','MARMILLOT','melanie.marmillot@caravenue.com','$2a$10$If5xK3YKRj231DX18GCwJORe.YOoX2gaa8CvPfH00SNdzZDefe.oK','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('7890e939-d641-4047-9bc1-7b9cd3811a18','Julie','Got','julie.got@omc.com','$2a$10$G/7B.eOiwcaeIhzhxsyas.3xrZod9yogSQc8YOFVa3dmZcOb0OeQK','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('797599da-d7e0-4746-b632-e1d684415661','Chloé','HAMON','chloe.hamon@cobredia.fr','$2a$10$Zx5SoZHlh06piTTe.WXJD.VyRnQ.bQ3kYdwzu5b3nxlQxvKBsy1mS','brand_admin','96b590af-068a-4d0b-a52f-1ce8e27cb672',NULL,true,NOW(),NOW()),
  ('7b0a252c-b44d-4e14-9081-75c81274a2f4','Marie','Peyrebrune','peyrebrune.m@partner.samsung.com','$2a$10$8oWyV.a7jAAJmwvpfQoezeapozUKlTIRFDvUjh0OzU.SScnnxP1Uu','brand_admin','d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229',NULL,true,NOW(),NOW()),
  ('7c58907c-3a8b-44d4-b1d6-0335b5dbaed1','Fabien','Wathle','fabien.wathle@ddb.fr','$2a$10$VA.4/z6wepo9dXnBDqJnKetnqrdDgucn4ZV8cQ/6/nf9mq9e9GS/e','admin','79453ad2-06a6-4886-aeb5-0a0e9bcc29ed',NULL,true,NOW(),NOW()),
  ('7dd87eb0-47a9-4af9-a15b-416e026ab61d','Arthur','Thouin','arthur.t@stride-up.fr','$2a$10$fo6wZHJZ.mayriVjMeuVP.fZ0qiXmOec96rNATtvCUa/yH2cZ4cte','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW()),
  ('809e9769-4874-4955-ab98-9a5a155adb97','Stéphane','Gazzo','stephane.gazzo@ddb.fr','$2a$10$Tcxs3RlMT6HLk5glkESfIemzdIeGKKf.fSLYs7k8lh.wVCoB0owf.','admin','79453ad2-06a6-4886-aeb5-0a0e9bcc29ed',NULL,true,NOW(),NOW()),
  ('81908546-ece6-4198-bed2-25632031fbaf','Nadine','Von Lennep','nadine.vonlennep@audi.de','$2a$10$1Y0pLM7FUuiCHlNWBkHUsOxBLWEFY6y2J.CcGkIVi3Wh54Lfkj.Nm','brand_admin','3e43e563-f69e-4573-8285-7283915a662f',NULL,true,NOW(),NOW())
ON CONFLICT (id) DO NOTHING;

-- We need to read the rest of the users from the dump (lines 378+)
-- Run: psql $DATABASE_URL -f migrate-from-mysql-part2.sql  after this file

COMMIT;

-- Verification
SELECT
  (SELECT COUNT(*) FROM "Company") AS companies,
  (SELECT COUNT(*) FROM "Franchise") AS franchises,
  (SELECT COUNT(*) FROM "User") AS users,
  (SELECT COUNT(*) FROM "Dashboard") AS dashboards;
