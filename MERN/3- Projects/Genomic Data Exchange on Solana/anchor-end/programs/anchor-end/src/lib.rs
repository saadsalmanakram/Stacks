use anchor_lang::prelude::*;

declare_id!("QWtuDBJZXhvPJx6JKNSA5bY998s1cfxE8C6wYgVH5bn");

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
