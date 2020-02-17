﻿using Oracle.ManagedDataAccess.Client;
using SO115App.Persistence.Oracle.Classi;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.Persistence.Oracle.Servizi.Mezzi
{
    public class GetListaMezziUtilizzabili
    {
        public List<ORAAutomezzi> GetListaAutomezziUtilizzabili(string CodSede)
        {
            List<ORAAutomezzi> ListaMezzi = new List<ORAAutomezzi>();

            DBContext context = new DBContext();
            Connessione InfoCon = context.GetConnectionFromCodiceSede(CodSede);

            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = conn;
            cmd.CommandText = "SELECT NVL(COD_AUTOMEZZO,0) as COD_AUTOMEZZO, " +
                "NVL(COD_GENERE_MEZZO,' ') as COD_GENERE_MEZZO, " +
                "NVL(COD_MODELLO_MEZZO,' ') as COD_MODELLO_MEZZO, " +
                "NVL(CASA_COSTRUTTRICE,' ') as CASA_COSTRUTTRICE, " +
                "NVL(COD_DISTACCAMENTO,0) as COD_DISTACCAMENTO, " +
                "NVL(DISTACCAMENTO,' ') as DISTACCAMENTO, " +
                "NVL(COD_DESTINAZIONE,' ') as COD_DESTINAZIONE, " +
                "NVL(SEZIONE,' ') as SEZIONE, " +
                "NVL(TARGA,' ') as TARGA, " +
                "NVL(SIGLA,' ') as SIGLA, " +
                "NVL(STATO,' ') as STATO, " +
                "NVL(PRIORITA_DIST,0) as PRIORITA_DIST, " +
                "NVL(PRIORITA_COMANDO,0) as PRIORITA_COMANDO, " +
                "NVL(COD_CHIAMATA_SELETTIVA,' ') as COD_CHIAMATA_SELETTIVA, " +
                "NVL(MEZZO_GPS,' ') as MEZZO_GPS, " +
                "NVL(FLAG_OPER,' ') as FLAG_OPER, " +
                "NVL(NOTE,' ') as NOTE, " +
                "NVL(NUM_SEZ_OPER,' ') as NUM_SEZ_OPER, " +
                "NVL(TIPO_MEZZO,' ') as TIPO_MEZZO, " +
                "NVL(COD_FORNITORE,0) as COD_FORNITORE COD_FORNITORE, " +
                "NVL(COD_COMANDO,' ') as COD_COMANDO, " +
                "NVL(MOV_ISTITUTO,' ') as MOV_ISTITUTO, " +
                "NVL(FONTE,' ') as FONTE, " +
                "NVL(UTENTE,' ') as UTENTE, " +
                "NVL(DISPOSITIVO_GPS_ATTIVO,' ') as DISPOSITIVO_GPS_ATTIVO " +
                "FROM SALAOPER.AUTOMEZZI " +
                "WHERE COD_COMANDO = '" + CodSede + "' " +
                "AND FLAG_OPER = 'S' " +
                "AND FONTE ='TC' " +
                "AND STATO NOT IN ('A','O','R','F') "; // ESCLUDO I PREACCOPPIATI ED I MEZZI FUORI SERVIZIO

            cmd.CommandType = CommandType.Text;
            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                ORAAutomezzi mezzo = new ORAAutomezzi();
                mezzo.COD_AUTOMEZZO = dr.GetInt32(0);
                mezzo.COD_GENERE_MEZZO = dr.GetString(1);
                mezzo.COD_MODELLO_MEZZO = dr.GetString(2);
                mezzo.CASA_COSTRUTTRICE = dr.GetString(3);
                mezzo.COD_DISTACCAMENTO = dr.GetInt32(4);
                mezzo.DISTACCAMENTO = dr.GetString(5);
                mezzo.COD_DESTINAZIONE = dr.GetString(6);
                mezzo.SEZIONE = dr.GetString(7);
                mezzo.TARGA = dr.GetString(8);
                mezzo.SIGLA = dr.GetString(9);
                mezzo.STATO = dr.GetString(10);
                mezzo.PRIORITA_DIST = dr.GetInt32(11);
                mezzo.PRIORITA_COMANDO = dr.GetInt32(12);
                mezzo.COD_CHIAMATA_SELETTIVA = dr.GetString(13);
                mezzo.MEZZO_GPS = dr.GetString(14);
                mezzo.FLAG_OPER = dr.GetString(15);
                mezzo.NOTE = dr.GetString(16);
                mezzo.NUM_SEZ_OPER = dr.GetString(17);
                mezzo.TIPO_MEZZO = dr.GetString(18);
                mezzo.COD_FORNITORE = dr.GetInt32(19);
                mezzo.COD_COMANDO = dr.GetString(20);
                mezzo.MOV_ISTITUTO = dr.GetString(21);
                mezzo.FONTE = dr.GetString(22);
                mezzo.UTENTE = dr.GetString(23);
                mezzo.DISPOSITIVO_GPS_ATTIVO = dr.GetString(24);

                ListaMezzi.Add(mezzo);
            }

            conn.Dispose();

            return ListaMezzi;
        }
    }
}