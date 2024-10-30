use anchor_lang::prelude::*;

declare_id!("FdNNaw1D3xqxLa6eJ3Wc1Ah1gU9txRg4Dup68Ene77R8");

#[program]
pub mod my_genomic_project {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
