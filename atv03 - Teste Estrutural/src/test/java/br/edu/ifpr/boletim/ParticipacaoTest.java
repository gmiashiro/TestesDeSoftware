package br.edu.ifpr.boletim;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

class ParticipacaoTest {
    @Test
    void testAmbosVerdadeiros() {
        Participacao part = new Participacao();
        int resultado = part.calcularPontos(true, true);
        assertEquals(3, resultado);
    }

    @Test
    void testEntregouAtividadeNaoParticipou() {
        Participacao part = new Participacao();
        int resultado = part.calcularPontos(true, false);
        assertEquals(2, resultado);
    }

    @Test
    void testNaoEntregouAtividadeParticipou() {
        Participacao part = new Participacao();
        int resultado = part.calcularPontos(false, true);
        assertEquals(1, resultado);
    }

    @Test
    void testAmbosFalsos() {
        Participacao part = new Participacao();
        int resultado = part.calcularPontos(false, false);
        assertEquals(0, resultado);
    }
}
