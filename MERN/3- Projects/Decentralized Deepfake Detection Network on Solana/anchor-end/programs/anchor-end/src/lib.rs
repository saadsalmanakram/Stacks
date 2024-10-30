use anchor_lang::prelude::*;

declare_id!("FSF6rTSMSMbLdxbjJ2cW7uswyANR3g1NHSvqARYeHip9");

#[program]
pub mod anchor_end {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
